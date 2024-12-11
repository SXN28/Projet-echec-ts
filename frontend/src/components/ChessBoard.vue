<script setup lang="ts">
import {ref, onMounted, inject, type Ref} from "vue";
import {chessService} from "@/services/chessService";

import kingWhite from "@/assets/chess-pieces/king_w.png";
import queenWhite from "@/assets/chess-pieces/queen_w.png";
import rookWhite from "@/assets/chess-pieces/rook_w.png";
import bishopWhite from "@/assets/chess-pieces/bishop_w.png";
import knightWhite from "@/assets/chess-pieces/knight_w.png";
import pawnWhite from "@/assets/chess-pieces/pawn_w.png";
import kingBlack from "@/assets/chess-pieces/king_b.png";
import queenBlack from "@/assets/chess-pieces/queen_b.png";
import rookBlack from "@/assets/chess-pieces/rook_b.png";
import bishopBlack from "@/assets/chess-pieces/bishop_b.png";
import knightBlack from "@/assets/chess-pieces/knight_b.png";
import pawnBlack from "@/assets/chess-pieces/pawn_b.png";

let board = ref([]);
let currentTurn = ref("white");
let selectedPiece = ref<{ row: number; col: number } | null>(null);
const gameId = inject("gameId") as Ref<number>;
let playerColor = ref("black");

const emit = defineEmits<{
  (event: 'moveMade'): void;
}>();

type PieceType = "K" | "Q" | "R" | "B" | "N" | "P";

type Cell = {
  color: "white" | "black";
  piece: PieceType;
};

onMounted(() => {
  loadBoard();
  getCurrentTurn();
});

function loadBoard() {
  chessService
      .loadBoard(gameId.value)
      .then((boardData) => {
        board.value = boardData;
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
}

function getPieceImage(cell: { color: string; piece: string }): any {
  const pieceImages = {
    white: {
      K: kingWhite,
      Q: queenWhite,
      R: rookWhite,
      B: bishopWhite,
      N: knightWhite,
      P: pawnWhite,
    },
    black: {
      K: kingBlack,
      Q: queenBlack,
      R: rookBlack,
      B: bishopBlack,
      N: knightBlack,
      P: pawnBlack,
    },
  };

  return pieceImages[cell.color][cell.piece];
}

function onDragStart(rowIndex: number, colIndex: number) {
  selectedPiece.value = {row: rowIndex, col: colIndex};
}

function getCurrentTurn() {
  chessService
      .getCurrentTurn(gameId.value)
      .then((turn) => {
        currentTurn.value = turn;
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du tour actuel :", error);
      });
}

function allowDrop(event: Event) {
  event.preventDefault();
}

async function onDrop(targetRow: number, targetCol: number) {
  if (!selectedPiece.value) return;

  const {row, col} = selectedPiece.value;

  const requestPayload = {
    gameId: gameId.value,
    fromRow: row,
    fromCol: col,
    toRow: targetRow,
    toCol: targetCol,
    playerColor: board.value[row][col].color,
  };

  console.log("Requête envoyée:", requestPayload);

  try {
    const res = await chessService.makeMove(requestPayload);
    if (res.status === 200) {
      loadBoard();
      emit('moveMade');
    } else {
      console.log("Erreur lors du déplacement", res.data);
    }
  } catch (error) {
    console.error("Erreur lors du déplacement:", error);
  }
}

async function createNewGame() {
  try {
    gameId.value++;
    const payload = {
      whitePlayerId: 1,
      blackPlayerId: 2,
    };
    const response = await chessService.createNewGame(payload);

    if (response.status === 200) {
      console.log("Nouvelle partie créée avec succès :", response.data);
      await chessService.deleteGame(gameId.value - 1);
      await loadBoard();
    } else {
      console.error("Erreur inattendue :", response.data);
    }
  } catch (error: any) {
    if (error.response) {
      console.error("Erreur lors de la création de la partie :", error.response.data);
    } else {
      console.error("Erreur de connexion au backend :", error.message);
    }
  }
}
</script>


<template>
  <div class="chessboard">
    <div class="controls">
      <div>
        <button @click="createNewGame">Créer une nouvelle partie</button>
      </div>

      <label for="gameIdInput">ID de la partie :</label>
      <input
          type="number"
          id="gameIdInput"
          v-model.number="gameId"
          @change="loadBoard"
      />
      <p>C'est au tour des {{ currentTurn }}</p>
    </div>

    <div
        v-for="(row, rowIndex) in board"
        :key="rowIndex"
        class="row">
      <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="cell"
          :class="{
          black: (rowIndex + colIndex) % 2 === 0,
          white: (rowIndex + colIndex) % 2 !== 0,
        }"
          @dragover.prevent="allowDrop"
          @drop="onDrop(rowIndex, colIndex)">
        <img
            v-if="cell"
            :src="getPieceImage(cell)"
            :alt="cell.piece"
            class="piece-image"
            draggable="true"
            @dragstart="onDragStart(rowIndex, colIndex)"
        />
      </div>
    </div>
  </div>
</template>


<style scoped>
.chessboard {
  border: 2px solid black;
  display: flex;
  align-items: center;
  flex-direction: column;
}


.row {
  display: flex;
}

.cell {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  box-sizing: border-box;
}

.cell.black {
  background-color: #769656;
}

.cell.white {
  background-color: #eeeed2;
}

.piece-image {
  width: 60px;
  height: 60px;
  cursor: grab;
}
</style>

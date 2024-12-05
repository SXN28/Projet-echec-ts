<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";

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
let gameId = ref(16);
let playerColor = ref("black");

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
  axios
      .get(`http://localhost:8000/games/${gameId.value}`)
      .then((response) => {
        board.value = JSON.parse(response.data.board);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
}

function getPieceImage(cell: { color: string; piece: string }) : any {
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
  selectedPiece.value = { row: rowIndex, col: colIndex };
}

function getCurrentTurn() {
  axios
      .get(`http://localhost:8000/games/${gameId.value}`)
      .then((response) => {
        currentTurn.value = response.data.turn;
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

  const { row, col } = selectedPiece.value;

  let res = await axios
      .post(`http://localhost:8000/moves`, {
        gameId: gameId.value,
        fromRow: row,
        fromCol: col,
        toRow: targetRow,
        toCol: targetCol,
        playerColor: board.value[row][col].color,
      });
  if(res.status === 200){
    loadBoard()
  } else {
    res.status
    res.data["message"]
  }
} 
</script>

<template>
  <div class="chessboard">

    <div class="controls">
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

.controls {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.row {
  display: flex;
}

.cell {
  width: 70px;
  height: 70px;
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

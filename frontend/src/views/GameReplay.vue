<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { chessService } from "@/services/chessService";

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

const initialBoard = [
  [
    { piece: "R", color: "white" },
    { piece: "N", color: "white" },
    { piece: "B", color: "white" },
    { piece: "Q", color: "white" },
    { piece: "K", color: "white" },
    { piece: "B", color: "white" },
    { piece: "N", color: "white" },
    { piece: "R", color: "white" },
  ],
  Array(8).fill({ piece: "P", color: "white" }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ piece: "P", color: "black" }),
  [
    { piece: "R", color: "black" },
    { piece: "N", color: "black" },
    { piece: "B", color: "black" },
    { piece: "Q", color: "black" },
    { piece: "K", color: "black" },
    { piece: "B", color: "black" },
    { piece: "N", color: "black" },
    { piece: "R", color: "black" },
  ],
];

const board = ref(initialBoard.map(row => row.map(cell => (cell ? { ...cell } : null))));
const moves = ref<Array<{ fromRow: number; fromCol: number; toRow: number; toCol: number }>>([]);
const currentMoveIndex = ref(0);

const route = useRoute();
const gameId = ref(Number(route.params.id));

const player1 = ref(localStorage.getItem("user1"));
const player2 = ref(localStorage.getItem("user2") || "Guest");

onMounted(async () => {
  await loadGame();
});

async function loadGame() {
  try {
    const gameData = await chessService.getGameDetails(gameId.value);
    moves.value = gameData.moves || [];
    console.log("Liste des mouvements chargés :", moves.value);
  } catch (error) {
    console.error("Erreur lors du chargement des données de la partie :", error);
  }
}

function getPieceImage(cell: { color: string; piece: string } | null): string | null {
  if (!cell) return null;

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

function playNextMove() {
  if (currentMoveIndex.value >= moves.value.length) return;

  const move = moves.value[currentMoveIndex.value];
  const piece = board.value[move.fromRow][move.fromCol];

  board.value[move.toRow][move.toCol] = piece;
  board.value[move.fromRow][move.fromCol] = null;

  currentMoveIndex.value++;
}

function playPreviousMove() {
  if (currentMoveIndex.value <= 0) return;

  currentMoveIndex.value--;
  const move = moves.value[currentMoveIndex.value];
  const piece = board.value[move.toRow][move.toCol];

  board.value[move.fromRow][move.fromCol] = piece;
  board.value[move.toRow][move.toCol] = null;
}
</script>

<template>
  <div class="chessboard">
    <div class="board">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
        <div
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            class="cell"
            :class="{
            black: (rowIndex + colIndex) % 2 === 0,
            white: (rowIndex + colIndex) % 2 !== 0,
          }"
        >
          <img
              v-if="cell"
              :src="getPieceImage(cell)"
              :alt="cell.piece"
              class="piece-image"
          />
        </div>
      </div>
    </div>
    <div class="replay-controls">
      <button
          @click="playPreviousMove"
          class="replay-button"
          :disabled="currentMoveIndex <= 0"
      >
        Précédent
      </button>
      <button
          @click="playNextMove"
          class="replay-button"
          :disabled="currentMoveIndex >= moves.length"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<style scoped>

html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
}

.chessboard {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  gap: 10px;
}

.board {
  border: 2px solid black;
  position: relative;
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
  cursor: pointer;
}

.replay-controls {
  display: flex;
  gap: 10px;
}

.replay-button {
  padding: 10px 20px;
  font-size: 1.2rem;
  color: white;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.replay-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>

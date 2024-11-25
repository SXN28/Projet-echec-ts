<template>
  <div class="chessboard">
    <div
        v-for="(row, rowIndex) in board"
        :key="rowIndex"
        class="row"
    >
      <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="cell"
          :class="{
          black: (rowIndex + colIndex) % 2 === 0,
          white: (rowIndex + colIndex) % 2 !== 0,
        }"
          @dragover.prevent="allowDrop"
          @drop="onDrop(rowIndex, colIndex)"
      >
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

<script>
import axios from "axios";

// Import explicite des images des pièces d'échecs
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

export default {
  name: "ChessBoard",
  data() {
    return {
      board: [],
      selectedPiece: null, // Pour stocker la pièce sélectionnée
      gameId: 9, // ID de la partie
      playerColor: "black", // Couleur du joueur
    };
  },
  mounted() {
    this.loadBoard();
  },
  methods: {
    loadBoard() {
      axios
          .get(`http://localhost:8000/games/${this.gameId}`)
          .then((response) => {
            this.board = JSON.parse(response.data.board);
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des données :", error);
          });
    },
    getPieceImage(cell) {
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
    },
    onDragStart(rowIndex, colIndex) {
      this.selectedPiece = {row: rowIndex, col: colIndex};
    },
    allowDrop(event) {
      event.preventDefault();
    },
    onDrop(targetRow, targetCol) {
      if (!this.selectedPiece) return;

      const {row, col} = this.selectedPiece;

      axios
          .post(`http://localhost:8000/moves`, {
            gameId: this.gameId,
            fromRow: row,
            fromCol: col,
            toRow: targetRow,
            toCol: targetCol,
            playerColor: this.playerColor,
          })
          .then(() => {
            this.loadBoard();
            this.selectedPiece = null;
          })
          .catch((error) => {
            console.error("Erreur lors du déplacement :", error);
            this.selectedPiece = null;
          });
    },
  },
};
</script>

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

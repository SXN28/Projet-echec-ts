<template>
  <div class="chessboard">
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
      <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="cell"
          :class="{
          black: (rowIndex + colIndex) % 2 === 0,
          white: (rowIndex + colIndex) % 2 !== 0
        }"
      >
        <span v-if="cell" id="text">{{ cell.piece }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ChessBoard',
  data() {
    return {
      board: []
    };
  },
  mounted() {
    axios.get('http://localhost:8000/games/4')
        .then(response => {
          this.board = JSON.parse(response.data.board);
          console.log(this.board);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données :", error);
        });
  }
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

#text{
  color : black;
}
</style>

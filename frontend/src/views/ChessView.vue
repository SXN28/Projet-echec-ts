<script setup lang="ts">
import { provide, ref, onMounted } from "vue";
import Chessboard from "@/components/ChessBoard.vue";
import SideMove from "@/components/SideMove.vue";
import MenuSide from "@/components/MenuSide.vue";
import { chessService } from "@/services/chessService";

const gameId = ref<number | null>(
    localStorage.getItem("gameId") ? parseInt(localStorage.getItem("gameId")!) : null
);

const currentTurn = ref("white");
const moves = ref([]);
const chessboardRef = ref(null);


provide("currentTurn", currentTurn);
provide("gameId", gameId);
provide("triggerChessboardLoadBoard", () => {
  chessboardRef.value?.loadBoard();
});

const fetchMoves = async () => {
  try {
    const response = await chessService.getMoves(gameId.value);
    moves.value = response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des mouvements:", error);
  }
};

const handleMoveMade = () => {
  fetchMoves();
};

onMounted(() => {
  fetchMoves();
});
</script>

<template>
  <div id="app-container">
    <div id="menu">
      <MenuSide />
    </div>
    <div id="chess">
      <Chessboard ref="chessboardRef" @moveMade="handleMoveMade" />
    </div>
    <div id="side">
      <SideMove :moves="moves" />
    </div>
  </div>
</template>

<style scoped>
#app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#menu {
  width: 20vw;
  height: 100vh;
}

#chess {
  width: 60vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#side {
  width: 20vw;
  height: 100vh;
}
</style>

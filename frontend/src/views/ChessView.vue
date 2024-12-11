<script setup lang="ts">
import Chessboard from "@/components/Chessboard.vue";
import SideMove from "@/components/SideMove.vue";
import {provide, ref, onMounted} from "vue";
import {chessService} from "@/services/chessService";

const gameId = ref(104);
const moves = ref([]);
provide("gameId", gameId);

const fetchMoves = async () => {
  try {
    const response = await chessService.getMoves(gameId.value);
    moves.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des mouvements:', error);
  }
};

onMounted(() => {
  fetchMoves();
});

const handleMoveMade = () => {
  fetchMoves();
};
</script>

<template>
  <div id="chess">
    <Chessboard @moveMade="handleMoveMade"/>
  </div>
  <div id="side">
    <SideMove :moves="moves"/>
  </div>
</template>

<style scoped>

#side {
  width: max-content;
  height: max-content;
  margin: 0;
  padding: 0;
}

#chess {
  width: max-content;
  height: max-content;
  display: flex;
  margin-right: 100px;
}
</style>

<script setup lang="ts">
import Chessboard from "@/components/Chessboard.vue";
</script>

<template>
  <div id="chess">
    <Chessboard />
  </div>
</template>

  <style scoped>
#chess {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

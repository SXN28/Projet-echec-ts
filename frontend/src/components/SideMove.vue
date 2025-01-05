<script lang="ts" setup>
import { ref, defineProps, inject } from 'vue';
import type { Ref } from 'vue';

interface Move {
  gameId: number;
  from: { row: number, col: number };
  to: { row: number, col: number };
  playerColor: string;
  createdAt: string;
}

const gameId = ref<number | null>(localStorage.getItem("gameId") ? parseInt(localStorage.getItem("gameId")!) : null);

const props = defineProps<{
  moves: Move[];
}>();

</script>

<template>
  <div class="move-list">
    <table v-if="moves.length > 0">
      <tbody>
      <tr v-for="(move, index) in moves" :key="index">
        <td>{{ move.gameId }}</td>
        <td>{{ move.from.row }}, {{ move.from.col }}</td>
        <td>{{ move.to.row }}, {{ move.to.col }}</td>
        <td>{{ move.playerColor }}</td>
        <td>{{ new Date(move.createdAt).toLocaleString() }}</td>
      </tr>
      </tbody>
    </table>
    <p v-else>Aucun mouvement trouvé pour ce jeu.</p>
  </div>
</template>

<style scoped>

table {
  width: 100%;
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>

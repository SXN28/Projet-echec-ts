<script lang="ts" setup>
import { ref, defineProps, onUpdated } from 'vue';

interface Move {
  gameId: number;
  from: { row: number, col: number };
  to: { row: number, col: number };
  playerColor: string;
  createdAt: string;
}

const props = defineProps<{
  moves: Move[];
}>();

const movesContainer = ref<HTMLDivElement | null>(null);

onUpdated(() => {
  if (movesContainer.value) {
    movesContainer.value.scrollTop = movesContainer.value.scrollHeight;
  }
});
</script>

<template>
  <div class="move-list">
    <div class="moves-container" ref="movesContainer">
      <div
          class="move-card"
          v-for="(move, index) in moves"
          :key="index"
      >
        <div class="move-header">
          <span class="move-index">#{{ index + 1 }}</span>
          <span class="move-player" :class="move.playerColor">
            {{ move.playerColor === 'white' ? '⚪ Blanc' : '⚫ Noir' }}
          </span>
        </div>
        <div class="move-details">
          <p>
            <strong>De :</strong> [{{ move.from.row }}, {{ move.from.col }}]
            <strong>À :</strong> [{{ move.to.row }}, {{ move.to.col }}]
          </p>
          <p><strong>Date :</strong> {{ new Date(move.createdAt).toLocaleString() }}</p>
        </div>
      </div>
    </div>
    <p v-if="moves.length === 0">Aucun mouvement trouvé pour ce jeu.</p>
  </div>
</template>

<style scoped>
.move-list {
  margin: 20px 0;
  font-family: Arial, sans-serif;
  color: #333;
}

.moves-container {
  max-height: 100vh; /* Limite la hauteur pour activer le défilement */
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f4f4f4; /* Gris clair */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.moves-container::-webkit-scrollbar {
  width: 8px;
}

.moves-container::-webkit-scrollbar-thumb {
  background-color: #bbb; /* Gris moyen */
  border-radius: 10px;
}

.moves-container::-webkit-scrollbar-thumb:hover {
  background-color: #999; /* Gris plus foncé */
}

.move-card {
  background-color: #afafaf;
  border: 1px solid #4a4a4a;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.move-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.move-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: bold;
}

.move-index {
  font-size: 1.1em;
  color: #555; /* Gris foncé */
}

.move-player {
  font-size: 1em;
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
}

.move-player.white {
  background-color: #6c757d; /* Gris neutre pour les joueurs blancs */
}

.move-player.black {
  background-color: #343a40; /* Gris foncé pour les joueurs noirs */
}

.move-details p {
  margin: 5px 0;
  font-size: 0.95em;
}

.move-details strong {
  color: #333; /* Texte en gris foncé */
}
</style>

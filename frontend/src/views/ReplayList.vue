<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { chessService } from "@/services/chessService";

// Liste des parties récupérées depuis l'API
const games = ref([]);
const router = useRouter();

// Chargement des parties de l'utilisateur lors du montage du composant
onMounted(() => {
  chessService
      .getUserGames()
      .then((userGames) => {
        games.value = userGames;
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des parties :", error);
      });
});


// Fonction pour accéder à la relecture d'une partie
function openGameReplay(gameId: number) {
  router.push({ name: "GameReplay", params: { id: gameId } });
}
</script>

<template>
  <div class="games-container">
    <h1 class="title">Mes Parties</h1>
    <div class="grid">
      <div
          v-for="game in games"
          :key="game.id"
          class="game-card"
      >
        <h3>Partie #{{ game.gameId }}</h3>
        <p>Date : {{ game.createdAt }}</p>
        <p>Joueur Blanc : {{ game.whitePlayerId }}</p>
        <p>Joueur Noir : {{ game.blackPlayerId }}</p>
        <p>Turn : {{ game.turn }}</p>
        <p>Status : {{ game.status }}</p>

        <div class="buttons">
          <button @click="openGameReplay(game.gameId)" class="replay-button">
            Rejouer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Conteneur principal */
.games-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 100vh;
  background: #f0f4f8;
  width: 100vw;
  box-sizing: border-box;
}

/* Titre principal */
.title {
  font-size: 2.5rem;
  color: #343a40;
  margin-bottom: 30px;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-bottom: 3px solid #007bff;
  display: inline-block;
  padding-bottom: 10px;
}

/* Grille des cartes */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
}

/* Style des cartes */
.game-card {
  background: #ffffff;
  border: 1px solid #dee2e6;
  color: #495057;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  text-align: center;
}

.game-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-8px);
}

/* Style des textes dans les cartes */
.game-card h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #007bff;
  font-weight: bold;
}

.game-card p {
  font-size: 1rem;
  margin: 5px 0;
  color: #6c757d;
}

/* Conteneur des boutons */
.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

/* Style des boutons */
button {
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.details-button {
  background-color: #007bff;
}

.details-button:hover {
  background-color: #0056b3;
}

.replay-button {
  background-color: #28a745;
}

.replay-button:hover {
  background-color: #218838;
}
</style>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { chessService } from "@/services/chessService";
import { UserService } from "@/services/userService";

const games = ref([]);
const users = ref([]);
const router = useRouter();

const username = ref(localStorage.getItem("user1") || "");

const selectedUsername = ref(username.value);

async function fetchGames(selectedUser: string) {
  try {
    console.log("Récupération des parties pour l'utilisateur :", selectedUser);
    if (!selectedUser) {
      console.log("Aucun utilisateur sélectionné.");
      games.value = [];
      return;
    }

    const userGames = await chessService.getUserGamesByUsername(selectedUser);
    console.log("Parties récupérées :", userGames);
    games.value = userGames;
  } catch (error) {
    console.error("Erreur lors de la récupération des parties :", error);
    games.value = [];
  }
}

async function fetchUsers() {
  try {
    console.log("Récupération des utilisateurs...");
    const allUsers = await UserService.getAllUsers();
    console.log("Utilisateurs récupérés :", allUsers);

    const usersWithShareReplay = await Promise.all(
        allUsers.map(async (user) => {
          try {
            const response = await UserService.getSharedUsers(user.id);
            return {
              ...user,
              shareReplays: response.data.shareReplays,
            };
          } catch {
            return {
              ...user,
              shareReplays: false,
            };
          }
        })
    );

    console.log("Utilisateurs avec partage de replays :", usersWithShareReplay);
    users.value = usersWithShareReplay;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
  }
}

function openGameReplay(gameId: number) {
  console.log("Ouverture du replay pour la partie :", gameId);
  router.push({ name: "GameReplay", params: { id: gameId } });
}

function selectUser(selectedUsernameTemp: string) {
  console.log("Utilisateur temporairement sélectionné :", selectedUsernameTemp);
  selectedUsername.value = selectedUsernameTemp;
}

onMounted(async () => {
  console.log("Chargement initial...");
  await fetchUsers();
  await fetchGames(selectedUsername.value);
});

watch(selectedUsername, async (newUsername, oldUsername) => {
  console.log(`Changement de l'utilisateur temporaire : ${oldUsername} -> ${newUsername}`);
  await fetchGames(newUsername);
});
</script>


<template>
  <div class="games-container">
    <h1 class="title">Parties de {{ selectedUsername }}</h1>
    <div v-if="games.length > 0" class="grid">
      <div
          v-for="game in games"
          :key="game.id"
          class="game-card"
      >
        <h3>Partie #{{ game.gameId }}</h3>
        <p>Joueur Blanc id : {{ game.whitePlayerId }}</p>
        <p>Joueur Noir id : {{ game.blackPlayerId }}</p>
        <p>Turn : {{ game.turn }}</p>
        <p>Status : {{ game.status }}</p>

        <div class="buttons">
          <button @click="openGameReplay(game.gameId)" class="replay-button">
            Rejouer
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="no-games">Aucune partie disponible pour cet utilisateur.</p>
    </div>

    <h1 class="title">Liste des Utilisateurs</h1>
    <div class="users-list">
      <div
          v-for="user in users"
          :key="user.id"
          :class="['user-card', user.shareReplays ? 'shared' : 'not-shared']"
          @click="user.shareReplays ? selectUser(user.username) : null"
          :style="{ cursor: user.shareReplays ? 'pointer' : 'not-allowed' }"
      >
        <h3>{{ user.username }}</h3>
        <p>ELO : {{ user.elo }}</p>
        <p>Status : {{ user.shareReplays ? "Partage activé" : "Partage désactivé" }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.games-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 100vh;
  background: #131313;
  width: 100vw;
  box-sizing: border-box;
}

.title {
  font-size: 2.5rem;
  color: #e4e4e4;
  margin-bottom: 30px;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-bottom: 3px solid #ffffff;
  display: inline-block;
  padding-bottom: 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
}

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

.game-card h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #131313;
  font-weight: bold;
}

.game-card p {
  font-size: 1rem;
  margin: 5px 0;
  color: #6c757d;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

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

.replay-button {
  background-color: #28a745;
}

.replay-button:hover {
  background-color: #218838;
}

.no-games {
  font-size: 1.2rem;
  color: #ffffff;
  margin-top: 20px;
  text-align: center;
}

.users-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  margin-top: 30px;
}

.user-card {
  background: #ffffff;
  border: 1px solid #dee2e6;
  color: #495057;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.user-card.shared {
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.user-card.not-shared {
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.user-card h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.user-card p {
  font-size: 1rem;
  margin: 5px 0;
}
</style>

<script setup lang="ts">
import {ref, onMounted, inject, type Ref} from "vue";
import { useRouter } from "vue-router";
import { chessService } from "@/services/chessService";

const router = useRouter();

const user = ref({
  username: localStorage.getItem("user1"),
  rating: 1200,
});

const activeMenu = ref("home");

const menus = [
  { id: "replay", label: "Replay", icon: "🏠" },
  { id: "profile", label: "Profile", icon: "⚙️" },
  { id: "classement", label: "classement", icon: "👤" },
  { id: "logout", label: "Déconnexion", icon: "⏻" },
];

const logout = () => {
  localStorage.clear();
  router.push("/login");
}

const isMenuActive = (menuId: string) => activeMenu.value === menuId;
const selectMenu = (menuId: string) => {
  if (menuId === "logout") {
    logout();
  } else if (menuId === "replay") {
    router.push("/replay");
  } else if (menuId === "classement") {
    router.push("/classement");
  }else {
    activeMenu.value = menuId;
  }
};

const gameId = inject<Ref<number | null>>("gameId");
const currentTurn = inject<Ref<string>>("currentTurn");

const triggerChessboardLoadBoard = inject<() => void>("triggerChessboardLoadBoard");

onMounted(() => {
  if (gameId) {
    triggerChessboardLoadBoard!();
    getCurrentTurn();
  }
});

function getCurrentTurn() {
  if (!gameId) return;
  chessService
      .getCurrentTurn(gameId.value)
      .then((turn) => {
        console.log(turn);
        currentTurn.value = turn;
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du tour actuel :", error);
      });
}

async function createNewGame() {
  try {
    const payload = {
      whitePlayerId: 1,
      blackPlayerId: 2,
    };

    const response = await chessService.createNewGame(payload);

    if (response.status === 200) {
      console.log("Nouvelle partie créée avec succès :", response.data);

      const newGameId = response.data.gameId;
      localStorage.setItem("gameId", newGameId);
      gameId!.value = newGameId;
      triggerChessboardLoadBoard!();
    } else {
      console.error("Erreur inattendue :", response.data);
    }
  } catch (error: any) {
    if (error.response) {
      console.error("Erreur lors de la création de la partie :", error.response.data);
    } else {
      console.error("Erreur de connexion au backend :", error.message);
    }
  }
}
</script>

<template>
  <div id="menu-side">
    <div class="menu-header">
      <div class="avatar">👤</div>
      <div class="user-info">
        <h3>{{ user.username }}</h3>
        <p>Rating: {{ user.rating }}</p>
      </div>
    </div>

    <div class="menu-options">
      <ul>
        <li
            v-for="menu in menus"
            :key="menu.id"
            :class="{ active: isMenuActive(menu.id) }"
            @click="selectMenu(menu.id)"
        >
          <span class="icon">{{ menu.icon }}</span>
          <span class="label">{{ menu.label }}</span>
        </li>
      </ul>
    </div>

    <div class="controls">
      <div>
        <button class="new-game-btn" @click="createNewGame">🎮 Créer une nouvelle partie</button>
      </div>
      <p class="current-turn">C'est au tour des <strong>{{ currentTurn }}</strong></p>
    </div>
  </div>
</template>

<style scoped>
#menu-side {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background-color: #2b2b2b;
  color: white;
  font-family: Arial, sans-serif;
  padding: 10px;
}

.menu-header {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #444;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  margin-right: 10px;
}

.user-info h3 {
  margin: 0;
  font-size: 1.2em;
}

.user-info p {
  margin: 0;
  font-size: 0.9em;
  color: #aaa;
}

.menu-options ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-options li {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.menu-options li:hover {
  background-color: #444;
}

.menu-options li.active {
  background-color: #555;
}

.icon {
  font-size: 1.2em;
  margin-right: 10px;
}

.label {
  font-size: 1em;
}

.controls {
  margin-top: 20px;
  text-align: center;
}

.new-game-btn {
  margin-bottom: 20px;
  padding: 10px 20px;
  font-size: 1em;
  font-weight: bold;
  border: none;
  border-radius: 30px;
  background: linear-gradient(135deg, #4CAF50, #81C784);
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.new-game-btn:hover {
  background: linear-gradient(135deg, #43A047, #66BB6A);
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.current-turn {
  font-size: 1.1em;
  color: #E0E0E0;
  margin-top: 10px;
}

.current-turn strong {
  color: #FFD700; /* Doré pour mettre en évidence le tour */
}
</style>

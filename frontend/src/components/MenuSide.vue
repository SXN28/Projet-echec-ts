<script setup lang="ts">
import {ref, onMounted, inject, type Ref} from "vue";
import { useRouter } from "vue-router";
import { chessService } from "@/services/chessService";
import eventBus from "@/eventBus";

const router = useRouter();

const user = ref({
  username: localStorage.getItem("user1"),
  rating: 1200,
});

const activeMenu = ref("home");

const menus = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "settings", label: "Settings", icon: "⚙️" },
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
  } else {
    activeMenu.value = menuId;
  }
};

const gameId = inject<Ref<number | null>>("gameId");
const currentTurn = ref("white");

const triggerChessboardLoadBoard = inject<() => void>("triggerChessboardLoadBoard");

// Charger les données initiales
onMounted(() => {
  if (gameId) {
    triggerChessboardLoadBoard!();
    getCurrentTurn();
  }
});

function getCurrentTurn() {
  if (!gameId) return;
  chessService
      .getCurrentTurn(gameId)
      .then((turn) => {
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

    <!-- Section des contrôles de parties -->
    <div class="controls">
      <div>
        <button @click="createNewGame">Créer une nouvelle partie</button>
      </div>
      <p>C'est au tour des {{ currentTurn }}</p>
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
}

.controls label {
  display: block;
  margin-top: 10px;
  font-size: 0.9em;
}

.controls button {
  margin-bottom: 10px;
  padding: 5px 10px;
  font-size: 0.9em;
  border: none;
  border-radius: 3px;
  background-color: #444;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.controls button:hover {
  background-color: #555;
}

.controls input {
  margin-top: 5px;
  padding: 5px;
  font-size: 0.9em;
  border: 1px solid #555;
  border-radius: 3px;
  background-color: #333;
  color: white;
}
</style>

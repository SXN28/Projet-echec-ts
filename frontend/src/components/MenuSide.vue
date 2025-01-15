<script setup lang="ts">
import { ref, onMounted, inject, type Ref } from "vue";
import { useRouter } from "vue-router";
import { chessService } from "@/services/chessService";
import { UserService } from "@/services/userService";

const router = useRouter();

const user = ref({
  username: localStorage.getItem("user1"),
  rating: 1200,
  shareReplays: false,
});

const activeMenu = ref("home");

const menus = [
  { id: "replay", label: "Replay", icon: "🏠" },
  { id: "classement", label: "classement", icon: "👤" },
  { id: "logout", label: "Déconnexion", icon: "⏻" },
];

const logout = () => {
  localStorage.clear();
  router.push("/login");
};

const isMenuActive = (menuId: string) => activeMenu.value === menuId;
const selectMenu = (menuId: string) => {
  if (menuId === "logout") {
    logout();
  } else if (menuId === "replay") {
    router.push("/replay");
  } else if (menuId === "classement") {
    router.push("/classement");
  } else {
    activeMenu.value = menuId;
  }
};

const gameId = inject<Ref<number | null>>("gameId");
const currentTurn = inject<Ref<string>>("currentTurn");

const triggerChessboardLoadBoard = inject<() => void>("triggerChessboardLoadBoard");

onMounted(async () => {
  if (gameId) {
    triggerChessboardLoadBoard!();
    getCurrentTurn();
  }

  const username = user.value.username!;
  try {
    const response = await UserService.getID(username);
    const userId = response.data.id;
    const response2 = await UserService.getSharedUsers(userId);
    user.value.shareReplays = response2.data.shareReplays;
    console.log("Données de partage des replays récupérées :", response2.data.shareReplays);
  } catch (error) {
    console.error("Erreur lors de la récupération des données de partage de replays :", error);
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

const toggleShareReplays = async () => {
  try {
    const currentShareReplays = user.value.shareReplays;
    const newShareReplays = !currentShareReplays;

    const username = user.value.username!;
    const response = await UserService.getID(username);
    const userId = response.data.id;

    await UserService.updateUser(userId, { shareReplays: newShareReplays });

    const response2 = await UserService.getSharedUsers(userId);
    console.log(response2.data.shareReplays);

    user.value.shareReplays = newShareReplays;
    console.log("État de partage des replays modifié :", newShareReplays);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de shareReplays :", error);
  }
};
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
      <div class="toggle-replays">
        <label for="toggle">Partager les replays</label>
        <input
            id="toggle"
            type="checkbox"
            :checked="user.shareReplays"
            @change="toggleShareReplays"
        />
      </div>
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
  color: #FFD700;
}

.toggle-replays {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

#toggle {
  appearance: none;
  width: 50px;
  height: 25px;
  background: #ccc;
  border-radius: 50px;
  position: relative;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#toggle:checked {
  background: linear-gradient(135deg, #4CAF50, #81C784);
}

#toggle::before {
  content: '';
  width: 21px;
  height: 21px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

#toggle:checked::before {
  transform: translateX(25px);
}

.toggle-replays label {
  font-size: 1em;
  font-weight: bold;
  color: #E0E0E0;
  cursor: pointer;
  transition: color 0.3s ease;
}

.toggle-replays label:hover {
  color: #FFD700;
}
</style>

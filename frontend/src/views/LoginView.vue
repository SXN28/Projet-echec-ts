<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { UserService } from "@/services/userService";
import { chessService } from "@/services/chessService";

interface User {
  username: string;
  password: string;
}

const users = reactive({
  user1: { username: "", password: "" },
  user2: { username: "", password: "" },
});

const isSinglePlayer = ref(true);
const router = useRouter();

const handleLogin = async () => {
  try {
    // Étape 1 : Login pour User 1
    const response1 = await UserService.login(users.user1);
    const token1 = response1.data.token;
    localStorage.setItem("token1", token1);
    localStorage.setItem("user1", users.user1.username);

    let user2ID = null;

    // Étape 2 : Définir l'adversaire
    if (isSinglePlayer.value) {
      user2ID = 1; // ID fixe pour l'adversaire en mode solo
    } else {
      const response2 = await UserService.login(users.user2);
      const token2 = response2.data.token;
      localStorage.setItem("token2", token2);
      localStorage.setItem("user2", users.user2.username);

      const user2Response = await UserService.getID(users.user2.username);
      user2ID = user2Response.data.id;
    }

    // Étape 3 : Récupérer l'ID du User 1
    const user1Response = await UserService.getID(users.user1.username);
    const user1ID = user1Response.data.id;

    // Étape 4 : Créer une partie
    const newGame = await chessService.createNewGame({
      whitePlayerId: user1ID,
      blackPlayerId: user2ID,
    });

    localStorage.setItem("id", user1ID);
    localStorage.setItem("gameId", newGame.data.gameId);

    console.log("Partie créée :", newGame.data);

    // Rediriger vers la page du jeu
    router.push("/chess");
  } catch (error) {
    console.error(error);
    alert("Échec de la connexion ou de la création de la partie.");
  }
};
</script>


<template>
  <div class="dual-login">
    <h1>Login</h1>

    <div class="toggle-mode">
      <label>
        <input type="checkbox" v-model="isSinglePlayer" />
        Solo Mode (Disable second user)
      </label>
    </div>

    <form @submit.prevent="handleLogin" class="login-form">
      <div class="user-login user-1">
        <h2>User 1 (main)</h2>
        <label>
          <span>Username:</span>
          <input type="text" v-model="users.user1.username" required />
        </label>
        <label>
          <span>Password:</span>
          <input type="password" v-model="users.user1.password" required />
        </label>
      </div>

      <div class="user-login user-2" :class="{ disabled: isSinglePlayer }">
        <h2>User 2</h2>
        <label>
          <span>Username:</span>
          <input
              type="text"
              v-model="users.user2.username"
              :disabled="isSinglePlayer"
              required
          />
        </label>
        <label>
          <span>Password:</span>
          <input
              type="password"
              v-model="users.user2.password"
              :disabled="isSinglePlayer"
              required
          />
        </label>
      </div>

      <button type="submit" class="login-button">Login</button>
    </form>
  </div>
</template>

<style scoped>
.dual-login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #1a1a1a, #000000);
  font-family: Arial, sans-serif;
  color: #f0f0f0;
  text-align: center;
}

h1 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #fff;
}

.toggle-mode {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #b0b0b0;
}

.login-form {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 30px;
}

.user-login {
  width: 30vw;
  height: 40vh;
  background: #121212;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.7);
  text-align: left;
  border: 1px solid #333;
}

.user-login.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.user-login h2 {
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.5rem;
  color: #e0e0e0;
}

label {
  display: block;
  margin-bottom: 15px;
  font-size: 14px;
}

label span {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #ccc;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  box-sizing: border-box;
  border: none;
  border-radius: 8px;
  background: #1e1e1e;
  color: #fff;
  font-size: 14px;
}

input:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  background: #292929;
}

button.login-button {
  padding: 15px 30px;
  background-color: #333333;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s, transform 0.2s;
}

button.login-button:hover {
  background-color: #444;
  transform: scale(1.05);
}

button.login-button:active {
  background-color: #222;
  transform: scale(0.95);
}
</style>

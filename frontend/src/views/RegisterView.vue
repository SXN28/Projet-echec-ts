<script setup lang="ts">
import { reactive } from 'vue';
import { UserService } from "@/services/userService";
import router from "@/router";

interface User {
  username: string;
  password: string;
}

const user = reactive({
  username: "",
  password: "",
});

const handleRegister = async () => {
  try {
    const response = await UserService.register(user);
    router.push({ name: 'login' });
  } catch (error) {
    console.error(error);
    alert("Registration failed. Please check your inputs.");
  }
};

const goToLogin = () => {
  router.push({ name: 'login' });
};
</script>

<template>
  <div class="register-container">
    <h1>User Registration</h1>

    <form @submit.prevent="handleRegister" class="register-form">
      <div class="user-register">
        <h2>Create Your Account</h2>
        <label>
          <span>Username:</span>
          <input type="text" v-model="user.username" required />
        </label>
        <label>
          <span>Password:</span>
          <input type="password" v-model="user.password" required />
        </label>
        <div class="buttons">
          <button type="submit" class="register-button">Register</button>
          <button type="button" class="login-button" @click="goToLogin">Login</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: #1e1e1e;
  font-family: Arial, sans-serif;
  color: #fff;
  text-align: center;
}

h1 {
  margin-bottom: 30px;
  font-size: 2rem;
  color: #e0e0e0;
}

.register-form {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.user-register {
  width: 100%;
  max-width: 400px;
  background: #2e2e2e;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
  text-align: left;
}

.user-register h2 {
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.5rem;
  color: #c0c0c0;
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
  color: #c0c0c0;
}

input {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #3b3b3b;
  color: #fff;
  font-size: 14px;
}

input:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

.buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

button {
  flex: 1;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

button.register-button {
  background-color: #444;
  color: #fff;
}

button.register-button:hover {
  background-color: #555;
}

button.login-button {
  background-color: #17c83e;
  color: white;
}

button.login-button:hover {
  background-color: #0056b3;
}
</style>

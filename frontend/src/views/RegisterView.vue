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
      </div>
      <button type="submit" class="register-button">Register</button>
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
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  font-family: Arial, sans-serif;
  color: #fff;
  text-align: center;
}

h1 {
  margin-bottom: 30px;
  font-size: 2rem;
}

.register-form {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.user-register {
  width: 30vw;
  height: 50vh;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
  backdrop-filter: blur(10px);
}

.user-register h2 {
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.5rem;
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
  color: #e0e0e0;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  box-sizing: border-box;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 14px;
}

input:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

button.register-button {
  padding: 15px 30px;
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s;
}

button.register-button:hover {
  background-color: #483d8b;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { UserService } from "@/services/userService";

const users = ref<Array<{ id: number; name: string; elo: number }>>([]);
const loading = ref(true);
const errorMessage = ref<string | null>(null);

async function fetchUsers() {
  try {
    const data = await UserService.getAllUsers();
    users.value = data.sort((a, b) => b.elo - a.elo); // Trier par Elo décroissant
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "Erreur inconnue.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchUsers();
});
</script>


<template>
  <div class="leaderboard">
    <div class="header">
      <h1>🏆 Classement des Utilisateurs</h1>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Chargement des données...</p>
    </div>
    <div v-if="errorMessage" class="error">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-if="!loading && !errorMessage" class="table-container">
      <table class="leaderboard-table">
        <thead>
        <tr>
          <th>#</th>
          <th>Nom</th>
          <th>Elo</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <td>{{ index + 1 }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.elo }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<style scoped>
.leaderboard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #1e1e1e, #2c3e50);
  color: #ecf0f1;
  font-family: "Arial", sans-serif;
  padding: 20px;
}

/* En-tête */
.header h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #f39c12;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

/* Chargement */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5rem;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-left-color: #f39c12;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Table */
.table-container {
  width: 35%;
  max-width: 800px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-table th,
.leaderboard-table td {
  padding: 15px;
  text-align: center;
  font-size: 1rem;
}

.leaderboard-table th {
  background-color: #34495e;
  color: #ecf0f1;
  font-weight: bold;
  text-transform: uppercase;
}

.leaderboard-table tr {
  transition: background-color 0.3s ease;
}

.leaderboard-table tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.1);
}

.leaderboard-table tr:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.leaderboard-table td {
  color: #ecf0f1;
}

.leaderboard-table td:nth-child(2) {
  font-weight: bold;
  color: #f39c12;
}
</style>

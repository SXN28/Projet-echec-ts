<script setup lang="ts">
import { ref, onMounted } from 'vue';

const username = ref<string | null>(null);


onMounted(() => {
  username.value = localStorage.getItem("username");
});
</script>


<template>
  <h1>Hey, {{ username }}!</h1>
</template>
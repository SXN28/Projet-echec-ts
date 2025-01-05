import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import ChessView from "@/views/ChessView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ReplayList from "@/views/ReplayList.vue";
import GameReplay from "@/views/GameReplay.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/chess",
      name: "chess",
      component: ChessView,
    },
    {
      path: "/replay",
      name: "replay",
      component: ReplayList,
    },
    {
      path: "/game/:id/replay",
      name: "GameReplay",
      component: GameReplay,
      props: true,
    },
  ],
});

export default router;

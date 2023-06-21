import { createRouter, createWebHistory, RouteRecordRaw, Router } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/views/index.vue"),
    meta: { keepalive: false, requireAuth: true },
  },
  {
    path: "/auth/login",
    name: "login",
    component: () => import("@/views/login.vue"),
    meta: { keepalive: false },
  },
];

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

export default router;

export const createDefaultRouter: (routes: Array<RouteRecordRaw>) => Router = routes =>
  createRouter({
    history: createWebHistory(),
    routes,
  });

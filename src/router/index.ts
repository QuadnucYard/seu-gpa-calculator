import { createRouter, createWebHistory, RouteRecordRaw, Router } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/views/index.vue"),
    meta: { keepalive: false },
  },
  {
    path: "/auth/login",
    name: "login",
    component: () => import("@/views/login.vue"),
    meta: { keepalive: false },
  },
  {
    path: "/display",
    name: "display",
    component: () => import("@/views/display.vue"),
    meta: { keepalive: false, requireAuth: true },
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

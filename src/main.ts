import { createApp } from "vue";
import App from "./App.vue";
import { Quasar, Notify } from "quasar";
import router from "./router";
import store from "./store";
import axios from "@/api/request";

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";

import "./styles/index.scss";

const app = createApp(App);
app.use(router).use(store);
app.use(Quasar, {
  plugins: { Notify },
  config: {
    notify: {
      /* look at QuasarConfOptions from the API card */
    },
  },
});

app.mount("#app");

router.beforeEach((to, from, next) => {
  console.log("beforeEach", to.meta.requireAuth);
  /* if (store.state.user && to.path.startsWith("/admin")) {
    initAdminMenu(router, store);
  } */
  if (to.meta.requireAuth) {
    if (store.state.user) {
      /* axios.get("/auth").then(resp => {
        if (resp) next();
      }); */
      next();
    } else {
      next({
        name: "login",
        query: { redirect: to.fullPath },
      });
    }
  } else {
    next();
  }
});

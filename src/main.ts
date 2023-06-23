import { createApp } from "vue";
import App from "./App.vue";
import { Quasar, Notify } from "quasar";
import router from "./router";
import pinia from "./store";

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";

import "./styles/index.scss";

const app = createApp(App);
app.use(router).use(pinia);
app.use(Quasar, {
  plugins: { Notify },
  config: {
    notify: {
      /* look at QuasarConfOptions from the API card */
    },
  },
});

app.mount("#app");

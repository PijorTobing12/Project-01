// FILE: main.js

import { createApp } from "vue";
import { Dialog, Quasar, Loading, Notify } from "quasar";
import router from "./router.js";
import axios from "axios";
// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";
import "./style.css";

axios.defaults.baseURL = import.meta.env.VITE_API;

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from "./App.vue";

const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: {
    Dialog,
    Loading,
    Notify,
  }, // import Quasar plugins and add here
});

// Assumes you have a <div id="app"></div> in your index.html
myApp.use(router);
myApp.mount("#app");

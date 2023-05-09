import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify.js";
import { loadFonts } from "./plugins/webfontloader.js";
import router from "./router/index.js";
import { pinia } from "./stores";

loadFonts();

const app = createApp(App).use(pinia).use(router).use(vuetify);

app.mount("#app");

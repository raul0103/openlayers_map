import "./bootstrap";
import { createApp } from "vue";

import { createPinia } from "pinia";
import OpenLayersMap from "vue3-openlayers";

import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(OpenLayersMap);

app.mount("#app");

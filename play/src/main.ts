import { createApp } from "vue";
import "./style.css";
import xzUI from "@xz-ui/components";
import App from "./App.vue";

const app = createApp(App);
app.use(xzUI);
app.mount("#app");

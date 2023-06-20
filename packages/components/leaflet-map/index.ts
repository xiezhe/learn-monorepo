import { App } from "vue";
import leafletMap from "./src/index.vue";

export default {
  install(app: App) {
    app.component("leafletMap", leafletMap);
  },
};

import { App } from "vue";
import circleGraph from "./src/index.vue";

export default {
  install(app: App) {
    app.component("circleGraph", circleGraph);
  },
};

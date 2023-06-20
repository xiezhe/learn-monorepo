import { App } from "vue";
import SchemaForm from "./src/index.vue";

export default {
  install(app: App) {
    app.component("schemaForm", SchemaForm);
  },
};

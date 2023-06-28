import { App } from "vue";
import schemaForm from "./schema-form";
import leafletMap from "./leaflet-map";
import circleGraph from "./circle-graph";
import Element from "element-plus";
import "element-plus/dist/index.css";
console.log(Element);
console.log(leafletMap);
const components = [schemaForm, leafletMap, circleGraph];

export default {
  install(app: App) {
    app.use(Element);
    components.map((component) => {
      app.use(component);
    });
  },
};

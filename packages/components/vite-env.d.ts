/// <reference types="vite/client" />
import type { DefineComponent } from 'vue';
declare module '*.vue' {
  const vueComponent: DefineComponent<{}, {}, any>;
  export default vueComponent;
}

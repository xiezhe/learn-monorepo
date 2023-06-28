<script setup>
import * as d3 from "d3";
export interface IProps{
  config: {
    holeWith: number
  }
};
const props = withDefaults(defineProps<IProps>, {

})
</script>
<template>
  <div class="circle-graph">
    <svg xmlns="http://www.w3.org/2000/svg">
      <circle x="10" y="20" r="100"></circle>
    </svg>
  </div>
</template>
<style scoped>
.circle-graph {
  height: 100%;
  & > svg {
    height: 100%;
    width: 100%;
  }
}
</style>

<script setup lang="ts">
import * as d3 from "d3";
import { drawerEmits } from "element-plus/es/components/index.js";
import { onMounted, ref } from "vue";
interface IProps {
  options: {
    centerRadius: number; // 中心圆半径；
    annulusWidth: number; // 圆环宽度
  };
  data: any[];
}
const props = withDefaults(defineProps<IProps>(), {
  options: () => ({
    centerRadius: 200,
    annulusWidth: 60,
  }),
  data: () => [
    [
      {
        type: "target",
        name: "张三",
      },
      {
        type: "normal",
        name: "李四",
      },
      {
        type: "normal",
        name: "王五",
      },
      {
        type: "normal",
        name: "赵六",
      },
      {
        type: "normal",
        name: "钱七",
      },
    ],
    [
      {
        type: "normal",
        name: "周八",
      },
    ],
  ],
});

const circleGraphRef = ref();
// 圆环g标签，所有圆环都放到里面
const annulusDOM = ref();
// 创建孔在图形里挖孔
const createHole = (position, radius) => {
  const pathDOM = d3.create("path");
  const { x, y } = position;
  pathDOM.attr("fill-rule", "evenodd");
  pathDOM.attr("fill", "#ff0");
  const circlePath = ` M ${x}, ${y} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${
    radius * 2
  },0 a ${radius},${radius} 0 1,0 -${radius * 2},0 `;
  pathDOM.attr("d", circlePath);
  return pathDOM;
  //   <path fill-rule="evenodd" d=" M 960, 300 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0 " />;
};
// 创建中心圆
const createCenterCircle = () => {
  const { width, height } = circleGraphRef.value.getBoundingClientRect();
  const centerPosition = { x: width / 2, y: height / 2 };
  console.log(centerPosition);
  const svg = d3.select(circleGraphRef.value).select("svg");
  //   const mark = svg
  //     .append('g')
  //     .attr('transform', `translate(${centerPosition.x}, ${centerPosition.y})`)
  //     .append('mask')
  //     .attr('id', 'circle')
  //     .append('circle')
  //     .attr('x', 100)
  //     .attr('y', 100)
  //     .attr('r', props.options.centerRadius + props.options.annulusWidth)
  //     .attr('fill', '#f0f');

  annulusDOM.value = svg
    .append("g")
    .attr("transform", `translate(${centerPosition.x}, ${centerPosition.y})`);
  // annulusDOM.value.append('circle').attr('x', 0).attr('y', 0).attr('r', props.options.centerRadius);
  // const group1 = annulusDOM.value.append('g');
  // group1
  //   .append('circle')
  //   .attr('cx', 0)
  //   .attr('cy', 0)
  //   .attr('r', props.options.centerRadius + props.options.annulusWidth)
  //   .attr('fill', '#f00');
  // const hole1 = createHole({ x: 0, y: 0 }, props.options.centerRadius);
  // group1.append((d) => {
  //   console.log(d);
  //   return hole1.node();
  // });
  props.data.forEach((data, index) => {
    createLevelAnnulus(data, index);
  });
};
const drawerNodes = () => {};
const createLevelAnnulus = (data, level: number) => {
  const { centerRadius, annulusWidth } = props.options;
  const levelAnnuluInnerRadius = centerRadius + annulusWidth * level;
  const levelAnnuluOutterRadius = centerRadius + annulusWidth * (level + 1);
  const colors = d3.quantize(d3.interpolateHcl("#fff", "#1fd6ff"), 10);
  const fillColor = d3.color(colors[level]).copy({ opacity: 1 / (level + 1) });
  console.log(fillColor);
  annulusDOM.value
    .append("path")
    .attr("fill", fillColor)
    .attr(
      "d",
      d3.arc()({
        innerRadius: levelAnnuluInnerRadius,
        outerRadius: levelAnnuluOutterRadius,
        startAngle: 0,
        fill: "#0ff",
        endAngle: 2 * Math.PI,
      })
    );
  drawerNodes(data);
};

onMounted(() => {
  createCenterCircle();
});
</script>
<template>
  <div class="circle-graph" ref="circleGraphRef">
    <svg xmlns="http://www.w3.org/2000/svg"></svg>
  </div>
</template>
<style lang="scss" scoped>
.circle-graph {
  height: 100%;
  & > svg {
    width: 100%;
    height: 100%;
  }
}
</style>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import * as d3 from 'd3';
import { angle2radian, radian2angle } from '@/utils/tool';

interface IProps {
  options: {
    centerSize: number; // 中心圆的大小
    centerRadius: number; // 中心圆半径；
    centerBorderWidth: number;
    annulusWidth: number; // 圆环宽度
    showType: 'more' | 'flat'; // 展示类型
    nodeSize: number; // 点的大小
    startAngle: number; // 其实渲染角度
    annulusSpace: number; // node 距离内圆的距离
    nodeSpace: number; // 每个圆之间间隙，不太准
  };
  data: any[];
}
const props = withDefaults(defineProps<IProps>(), {
  options: () => ({
    centerSize: 50,
    centerRadius: 50,
    centerBorderWidth: 3,
    annulusWidth: 160,
    showType: 'more',
    nodeSize: 60,
    annulusSpace: 40,
    startAngle: 0,
    nodeSpace: 1,
  }),
  data: () => [
    [
      {
        type: 'target',
        name: '蔡静',
      },
    ],
    [
      {
        type: 'target',
        name: '张三',
        operates: [
          {
            type: 'message',
          },
          {
            type: 'group',
          },
        ],
      },
      {
        type: 'normal',
        name: '李四',
        operates: [
          {
            type: 'message',
          },
          {
            type: 'group',
          },
        ],
      },
      {
        type: 'normal',
        name: '王五',
        operates: [
          {
            type: 'message',
          },
          {
            type: 'group',
          },
        ],
      },
      {
        type: 'normal',
        name: '赵六',
        operates: [
          {
            type: 'message',
          },
          {
            type: 'group',
          },
        ],
      },
      {
        type: 'normal',
        name: '钱七',
        operates: [
          {
            type: 'message',
          },
          {
            type: 'group',
          },
        ],
      },
      // {
      //   type: 'target',
      //   name: '张11三',
      // },
      // {
      //   type: 'normal',
      //   name: '李11四',
      // },
      // {
      //   type: 'normal',
      //   name: '王11五',
      // },
      // {
      //   type: 'normal',
      //   name: '赵11六',
      // },
      // {
      //   type: 'normal',
      //   name: '钱11七',
      // },
      // {
      //   type: 'normal',
      //   name: '赵11六',
      // },
      // {
      //   type: 'normal',
      //   name: '钱11七',
      // },
      // {
      //   type: 'normal',
      //   name: '赵11六',
      // },
      // {
      //   type: 'normal',
      //   name: '钱11七',
      // },
      // {
      //   type: 'normal',
      //   name: '钱11七',
      // },
      // {
      //   type: 'normal',
      //   name: '赵11六',
      // },
      // {
      //   type: 'normal',
      //   name: '钱11七',
      // },
    ],
    [
      {
        type: 'normal',
        name: '周八',
        operates: [
          {
            type: 'message',
          },
          {
            type: 'group',
          },
        ],
      },
    ],
    [
      {
        type: 'normal',
        name: '迁就',
        operates: [
          {
            type: 'message',
          },
          {
            type: 'group',
          },
        ],
      },
    ],
  ],
});
const emits = defineEmits([
  'clickCount',
  'clickOperate',
  'selectNode',
  'selectCenter',
  'selectNode',
]);

const circleGraphRef = ref();
const wrapGroup = ref();
// 圆环g标签，所有圆环都放到里面
const annulusDOM = ref();
// colors 颜色集合
const colors = computed(() => {
  return d3.quantize(d3.interpolateHcl('#fff', '#1fd6ff'), props.data.length);
});
const zoomed = (e) => {
  wrapGroup.value.attr('transform', e.transform);
};
const clearCanvas = () => {
  console.log(d3.select(wrapGroup.value));
  d3.select('#wrap').node().remove();
};
// 创建孔在图形里挖孔
const createHole = (position, radius) => {
  const pathDOM = d3.create('path');
  const { x, y } = position;
  pathDOM.attr('fill-rule', 'evenodd');
  pathDOM.attr('fill', '#ff0');
  const circlePath = ` M ${x}, ${y} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${
    radius * 2
  },0 a ${radius},${radius} 0 1,0 -${radius * 2},0 `;
  pathDOM.attr('d', circlePath);
  return pathDOM;
  //   <path fill-rule="evenodd" d=" M 960, 300 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0 " />;
};
const drawCenter = () => {
  const { centerSize, centerRadius, centerBorderWidth } = props.options;
  const centerNodeGroup = annulusDOM.value.append('g').attr('name', 'center-node-g');
  centerNodeGroup
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', centerRadius)
    .attr('fill', d3.color(colors.value[1]).copy({ opacity: 0.2 }));
  centerNodeGroup
    .selectAll('foreignObject')
    .data(props.data[0])
    .enter()
    .append('foreignObject')
    .attr('width', `${centerSize}px`)
    .attr('height', `${centerSize}px`)
    .attr('x', -centerSize / 2)
    .attr('y', -centerSize / 2)
    .append('xhtml:div')
    .classed('node-target', true)
    .style('width', `${centerSize}px`)
    .style('height', `${centerSize}px`)
    .style('line-height', `${centerSize - centerBorderWidth * 2}px`) // border的宽度
    .style('border-width', centerBorderWidth)
    .text((data) => data.name)
    .on('click', (data) => {
      emits('selectCenter', data);
    });
};
// 创建中心圆
const createCenterCircle = () => {
  const { width, height } = circleGraphRef.value.getBoundingClientRect();
  const centerPosition = { x: width / 2, y: height / 2 };
  const { centerSize } = props.options;
  const svg = d3.select(circleGraphRef.value).select('svg');
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
  wrapGroup.value = svg.append('g').attr('name', 'wrap').attr('id', 'wrap');
  // 绑定缩放
  svg.call(d3.zoom().on('zoom', zoomed));
  annulusDOM.value = wrapGroup.value
    .append('g')
    .classed('annulus-graph', true)
    .attr('name', 'annulus-graph')
    .attr('transform', `translate(${centerPosition.x}, ${centerPosition.y})`);
  drawCenter();
  for (let i = 1; i < props.data.length; i++) {
    createLevelAnnulus(props.data[i], i);
  }
};
// 计算圆内放下多少个
const computedArcNode = (nodeRadius: number, radius: number) => {
  const sinValue = nodeRadius / radius;
  const angle = radian2angle(Math.sin(sinValue));
  const degree = angle * 2;
  const count = Math.floor(360 / degree);
  return { count, degree };
};
// 计算点的圆心所在
const computedNodeCircleCenterPosition = (degree: number, radius: number) => {
  const radian = angle2radian(degree);
  const x = Math.cos(radian) * radius;
  const y = Math.sin(radian) * radius;
  return { x, y };
};
const resetSelectStatus = () => {
  console.log(props.data);
  props.data.forEach((item) => {
    item.forEach((data) => {
      Reflect.set(data, 'selected', false);
    });
  });
  console.log('1111111111111111', props.data);
  d3.selectAll('.annulus-item').selectAll('.node-text').classed('selected', false);
};
const drawNodeAndLine = (data, wrapDom, avargeDegree, radius) => {
  console.log('111111111111111111', data);
  const { nodeSize, centerSize, annulusWidth } = props.options;
  // const rotateDegree = avargeDegree * index;
  // console.log(rotateDegree);
  const annulusItem = wrapDom
    .selectAll('.annulus-item')
    .data(data)
    .enter()
    .insert('g', '.annulus-item')
    .classed('annulus-item', true)
    .attr('name', 'annulus-item');
  const lineGroup = annulusItem.append('g').attr('name', 'line');
  const nodeGroup = annulusItem.append('g').attr('name', 'node');
  const operateGroup = annulusItem.append('g').attr('name', 'opetate');
  lineGroup
    .append('line')
    .classed('line', true)
    .attr('id', (data, index) => `line${index}`)
    .attr('stroke-dasharray', '5 5')
    .attr('stroke-dashoffset', '5 5')
    .attr('x1', (data, index) => {
      const { x } = computedNodeCircleCenterPosition(
        -90 + avargeDegree * index,
        radius + nodeSize / 2
      );
      return x;
    })
    .attr('y1', (data, index) => {
      const { y } = computedNodeCircleCenterPosition(
        -90 + avargeDegree * index,
        radius + nodeSize / 2
      );
      return y;
    })
    .attr('x2', (data, index) => {
      const { x } = computedNodeCircleCenterPosition(
        -90 + avargeDegree * index,
        (centerSize + 14) / 2
      );
      return x;
    })
    .attr('y2', (data, index) => {
      const { y } = computedNodeCircleCenterPosition(
        -90 + avargeDegree * index,
        (centerSize + 14) / 2
      );
      return y;
    })
    .attr('stroke', '#82868e')
    .attr('marker-end', 'url(#arrow)');
  // // 添加节点
  const nodeContent = nodeGroup
    .append('foreignObject')
    .attr('width', `${annulusWidth}px`)
    .attr('height', `${annulusWidth}px`)
    .attr('style', (data, index) => {
      return `transform: translate(${-annulusWidth / 2}px, ${-annulusWidth / 2}px); `;
    })
    .attr('x', (data, index) => {
      const { x } = computedNodeCircleCenterPosition(-90 + avargeDegree * index, radius);
      return x;
    })
    .attr('y', (data, index) => {
      const { y } = computedNodeCircleCenterPosition(-90 + avargeDegree * index, radius);
      return y;
    })
    .append('xhtml:div')
    .attr('style', (data, index) => {
      return `transform: rotate(${avargeDegree * index}deg) `;
    })
    .classed('node-content', true);
  nodeContent
    .append('div')
    .style('width', `${nodeSize}px`)
    .style('height', `${nodeSize}px`)
    .style('transform', (data, index) => {
      return `rotate(-${avargeDegree * index}deg)`;
    })
    .classed('node-text', true)
    .classed('selected', (data) => {
      return data.selected;
    })
    .text((data) => data.name)
    .on('click', function (event, data, index) {
      console.log(event, data, index);
      console.log(this);
      const isSelected = data.selected;
      resetSelectStatus();
      Reflect.set(data, 'selected', !isSelected);
      d3.select(this).classed('selected', data.selected);
      // d3.select(this.parentNode.parentNode.parentNode.parentNode)
      //   .select('.line')
      //   .attr('stroke', () => {
      //     return data.selected ? 'rgba(0, 121, 254, 1)' : '#9ca6c1';
      //   })
      //   .attr('marker-end', () => {
      //     return `url(#${data.selected ? 'arrowSelect' : 'arrow'})`;
      //   });
      emits('selectNode', data);
    });
  nodeContent
    .append('div')
    .classed('node-count', true)
    .text((data) => data.count || 0)
    .on('click', (event, data) => {
      emits('clickCount', data);
    });

  // 操作部分的dom
  const opearteWarp = nodeContent.append('div').classed('node-operate', true);
  opearteWarp
    .selectAll('node-operate-item')
    .data(opearteWarp?.datum()?.operates)
    .enter()
    .append('div')
    .classed('node-operate-item', true)
    .classed('message', (data) => data.type === 'message')
    .classed('group', (data) => data.type === 'group')
    .on('click', (event, data) => {
      emits('clickOperate', opearteWarp.datum(), data.type);
    });
};
const drawNodesAndLines = (data, nodeRadius: number, innerRadius: number, annulusDOM) => {
  const { nodeSize, centerSize, annulusWidth } = props.options;
  const { count } = computedArcNode(annulusWidth / 2, innerRadius + annulusWidth / 2);
  const renderCount = count > data.length ? data.length : count;
  const avargeDegree = 360 / renderCount;
  const radius = innerRadius + annulusWidth / 2;
  // data.forEach((item, index) => {
  //   drawNodeAndLine(item, annulusDOM, avargeDegree, radius, index);
  // });
  drawNodeAndLine(data, annulusDOM, avargeDegree, radius);
};
const normalRenderAnnulus = (
  data,
  level: number,
  levelAnnuluInnerRadius: number,
  levelAnnuluOutterRadius: number,
  count: number
) => {
  const { nodeSize, annulusSpace } = props.options;
  const fillColor = d3.color(colors.value[level]).copy({ opacity: 0.2 });
  const annulusLevel = annulusDOM.value
    .insert('g', '.annulus-level')
    .classed('annulus-level', true)
    .attr('name', 'annulus-level');
  annulusLevel
    .append('path', 'annulus-range')
    .attr('fill', fillColor)
    .attr('stroke', '#f7faff')
    .classed('annulus-range', true)
    .attr(
      'd',
      d3.arc()({
        innerRadius: levelAnnuluInnerRadius,
        outerRadius: levelAnnuluOutterRadius,
        startAngle: 0,
        endAngle: 2 * Math.PI,
      })
    );
  // 在圆环上画圆
  drawNodesAndLines(data, nodeSize / 2, levelAnnuluInnerRadius, annulusLevel);
};
// 平铺所有点
const flatRenderAnnulus = (
  data,
  level: number,
  levelAnnuluInnerRadius: number,
  levelAnnuluOutterRadius: number,
  count: number
) => {
  // 剩余的渲染个数
  const surplus = data.length - count;
  const { nodeSize, annulusWidth } = props.options;
  const fillColor = d3.color(colors.value[level]).copy({ opacity: 0.2 });
  const annulusLevel = annulusDOM.value.append('g', 'annulus-level');
  const { count1 } = computedArcNode(annulusWidth / 2, levelAnnuluInnerRadius, annulusLevel);
  if (surplus < count1) {
    annulusDOM.value
      .append('path')
      .attr('fill', fillColor)
      .attr('stroke', '#f00')
      .attr(
        'd',
        d3.arc()({
          innerRadius: levelAnnuluInnerRadius,
          outerRadius: levelAnnuluOutterRadius,
          startAngle: 0,
          endAngle: 2 * Math.PI,
        })
      );
    // 在圆环上画圆
    drawNodesAndLines(data, nodeSize / 2, levelAnnuluInnerRadius, annulusDOM.value);
  }
};
const createLevelAnnulus = (data, level: number) => {
  const { centerRadius, annulusWidth, nodeSize, annulusSpace, showType } = props.options;
  const levelAnnuluInnerRadius = centerRadius + annulusWidth * (level - 1);
  const levelAnnuluOutterRadius = centerRadius + annulusWidth * level;

  const { count } = computedArcNode(annulusWidth / 2, levelAnnuluInnerRadius + annulusWidth / 2);
  if (data.length > count) {
    if (showType === 'more') {
      data.splice(count - 1, 0, { type: 'target', name: '更多' });
      normalRenderAnnulus(data, level, levelAnnuluInnerRadius, levelAnnuluOutterRadius, count);
    } else if (showType === 'flat') {
      flatRenderAnnulus();
    }
  } else {
    normalRenderAnnulus(data, level, levelAnnuluInnerRadius, levelAnnuluOutterRadius, count);
  }
};

onMounted(() => {
  createCenterCircle();
  // clearCanvas();
});
watch(
  () => props.data,
  () => {
    clearCanvas();
    createCenterCircle();
  },
  {
    deep: true,
  }
);
watch(
  () => props.options,
  () => {
    clearCanvas();
    createCenterCircle();
  },
  {
    deep: true,
  }
);
</script>
<template>
  <div class="circle-graph" ref="circleGraphRef">
    <svg xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" orient="auto" refY="5">
          <path d="M0,0 L10,5 0,10" fill="#9ca6c1" />
        </marker>
        <marker id="arrowSelect" markerWidth="10" markerHeight="10" orient="auto" refY="5">
          <path d="M0,0 L10,5 0,10" fill="rgba(0, 121, 254, 1)" />
        </marker>
      </defs>
    </svg>
  </div>
</template>
<style lang="scss" scoped>
.circle-graph {
  height: 100%;
  & > svg {
    width: 100%;
    height: 100%;
  }
  @keyframes dashAnimate {
    100% {
      stroke-dashoffset: 0;
    }
  }
  :deep(.node-target) {
    border-radius: 50%;
    border: 3px solid #fb2781;
    text-align: center;
    color: #fb2781;
  }
  :deep(.line) {
    animation: dashAnimate 1s linear infinite alternate;
  }
  :deep(.node-content) {
    width: 100%;
    height: 100%;
    padding: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .node-text {
      cursor: pointer;
      &.selected {
        background-color: rgba(0, 121, 254, 1);
      }
      background-color: #9ca6c1;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 100%;
      height: 100%;
      text-align: center;
      color: #fff;
      font-size: 12px;
    }
    .node-count {
      text-align: center;
      color: #0079fe;
      cursor: pointer;
    }
    .node-operate-item {
      width: 22px;
      height: 22px;
      background-size: 80%;
      cursor: pointer;
      margin: 2px;
      background-repeat: no-repeat;
      background-color: #9ca6c1;
      background-position: center center;
      border-radius: 50%;
      padding: 2px;
    }
    .message {
      background-image: url('@/assets/icons/message-comment.svg');
    }
    .group {
      background-image: url('@/assets/icons/join-group.svg');
    }
  }
}
</style>

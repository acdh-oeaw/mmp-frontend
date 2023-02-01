<script lang="ts" setup>
import ForceGraph, { type ForceGraphInstance } from 'force-graph';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  backgroundColor?: string;
  dagMode?: string;
  graph?: { nodes: Array<any>; edges: Array<any> };
  forceCenter?: () => any;
  forceLink?: () => any;
  forceCollision?: () => any;
  linkDirectionalArrowLength?: number;
  linkDirectionalArrowRelPos?: number;
  linkDirectionalParticles?: number;
  linkDirectionalParticleSpeed?: number;
  linkDirectionalParticleWidth?: number;
  linkWidth?: string;
  nodeId?: string;
  nodeRelSize?: number;
  nodeCanvasObject?: () => any;
  nodeCanvasObjectMode?: () => any;
  nodePointerAreaPaint?: () => any;
  onNodeClick?: () => any;
  onNodeDrag?: () => any;
  onNodeDragEnd?: () => any;
  onSimulationEnd?: () => any;
  onSimulationTick?: () => any;
  paused?: boolean;
  refresh?: number;
  autoPauseRedraw?: boolean;
  selectedNodeIds?: Set<any>; // TODO:
  showNeighborsOnly?: boolean;
  width?: number;
  height?: number;
  zoomToFit?: boolean;
}>();

const visWrapperRef = ref<HTMLElement | null>(null);
const graphDom = ref<ForceGraphInstance | null>(null);
const observer = ref<ResizeObserver | null>(null);

onMounted(() => {
  if (visWrapperRef.value == null) return;

  graphDom.value = ForceGraph()(visWrapperRef.value);

  setCanvas();

  // resize canvas on div resize
  observer.value = new ResizeObserver((entries) => {
    const [entry] = entries;

    if (entry == null) return;

    const rect = entry.contentRect;

    graphDom.value?.width(rect.width).height(rect.height);
  });

  observer.value.observe(visWrapperRef.value);
});

onUnmounted(() => {
  observer.value?.disconnect();
});

watch(
  () => props.graph,
  (val) => {
    graphDom.value?.graphData(transformedData(val));
  },
  { deep: true }
);

watch(
  () => props.refresh,
  () => {
    graphDom.value?.d3ReheatSimulation();
  }
);

watch(
  () => props.zoomToFit,
  () => {
    // cheap workaround, change zoomToFit to !zoomToFit to zoom (to fit)
    graphDom.value?.zoomToFit(500);
  }
);

function transformedData(obj: any) {
  const sorted = {
    nodes: [...obj.nodes].sort((a, b) => b.val - a.val),
    links: obj.edges,
  };
  return sorted;
}

function setCanvas() {
  if (graphDom.value == null) return;

  graphDom.value
    .nodeLabel('label')
    .height(props.height)
    .width(props.width)
    .backgroundColor(props.backgroundColor)
    .dagMode(props.dagMode ?? null)
    .onNodeClick(props.onNodeClick)
    .onNodeDrag(props.onNodeDrag)
    .onNodeDragEnd(props.onNodeDragEnd)
    .onEngineStop(props.onSimulationEnd)
    .onEngineTick(props.onSimulationTick)
    .autoPauseRedraw(props.autoPauseRedraw ?? true)
    .linkWidth(parseFloat(props.linkWidth) || 1)
    .linkDirectionalParticles(props.linkDirectionalParticles || 0)
    .linkDirectionalParticleSpeed(props.linkDirectionalParticleSpeed || 0.01)
    .linkDirectionalParticleWidth(props.linkDirectionalParticleWidth || 4)
    .linkDirectionalArrowLength(props.linkDirectionalArrowLength || 0)
    .linkDirectionalArrowRelPos(props.linkDirectionalArrowRelPos || 0.5)
    .nodeId(props.nodeId || 'id')
    .graphData(
      transformedData(
        props.graph || {
          nodes: [],
          edges: [],
          types: {
            nodes: [],
            edges: [],
          },
        }
      )
    )
    // .d3Force('collide', d3.forceCollide().radius((d) => d.val + 20).iterations(3))
    .nodeRelSize(props.nodeRelSize || 1)
    .nodeCanvasObject(props.nodeCanvasObject)
    .nodeCanvasObjectMode(props.nodeCanvasObjectMode)
    .nodePointerAreaPaint(props.nodePointerAreaPaint);

  if (props.forceCenter !== undefined) graphDom.value?.d3Force('center', props.forceCenter());
  if (props.forceLink !== undefined) graphDom.value?.d3Force('link', props.forceLink());
  if (props.forceCollision !== undefined)
    graphDom.value?.d3Force('collide', props.forceCollision());
}
</script>

<template>
  <div id="parentDiv">
    <div ref="visWrapperRef" class="visualization" />
  </div>
</template>

<script lang="ts" setup>
import type { forceCenter, forceCollide, forceLink } from 'd3';
import ForceGraph, { type ForceGraphInstance } from 'force-graph';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  backgroundColor: string;
  dagMode: Parameters<ForceGraphInstance['dagMode']>[0];
  graph: object;
  forceCenter: typeof forceCenter;
  forceLink: typeof forceLink;
  forceCollision: typeof forceCollide;
  linkDirectionalArrowLength: number;
  linkDirectionalArrowRelPos: number;
  linkDirectionalParticles: number;
  linkDirectionalParticleSpeed: number;
  linkDirectionalParticleWidth: number;
  linkWidth: string;
  nodeCanvasObject: Parameters<ForceGraphInstance['nodeCanvasObject']>[0];
  nodeCanvasObjectMode: Parameters<ForceGraphInstance['nodeCanvasObjectMode']>[0];
  nodePointerAreaPaint: Parameters<ForceGraphInstance['nodePointerAreaPaint']>[0];
  onNodeClick: Parameters<ForceGraphInstance['onNodeClick']>[0];
  onNodeDrag: Parameters<ForceGraphInstance['onNodeDrag']>[0];
  onNodeDragEnd: Parameters<ForceGraphInstance['onNodeDragEnd']>[0];
  nodeRelSize: number;
  onSimulationEnd: Parameters<ForceGraphInstance['onEngineStop']>[0];
  onSimulationTick: Parameters<ForceGraphInstance['onEngineTick']>[0];
  paused: boolean;
  refresh: number;
  autoPauseRedraw: boolean;
  selectedNodeIds: Set<any>;
  showNeighborsOnly: boolean;
  width: number;
  height: number;
  zoomToFit: boolean;
}>();

const elementRef = ref<HTMLDivElement | null>(null);
let graphDom: ForceGraphInstance | null = null;
let observer: ResizeObserver | null = null;

onMounted(() => {
  if (elementRef.value == null) return;

  graphDom = ForceGraph()(elementRef.value);
  setCanvas();

  observer = new ResizeObserver((entries) => {
    const [entry] = entries;

    if (entry == null) return;
    if (graphDom == null) return;

    const rect = entry.contentRect;
    graphDom.width(rect.width).height(rect.height);
  });

  observer.observe(elementRef.value);
});

watch(
  () => props.graph,
  (graph) => {
    graphDom?.graphData(transformedData(graph));
  },
  { deep: true }
);

watch(
  () => props.refresh,
  () => {
    graphDom?.d3ReheatSimulation();
  }
);

watch(
  () => props.zoomToFit,
  () => {
    graphDom?.zoomToFit(500);
  }
);

function transformedData(obj: any) {
  const sorted = {
    nodes: [...obj.nodes].sort((a, b) => b.val - a.val),
    links: obj.edges,
  };
  return sorted;
}

function addColorAndType(arr: Array<any>, typeArr: Array<any>) {
  const retArr = arr.map((node) => {
    const retNode = node;
    const nodeType = typeArr.filter((type) => type.id === node.type)[0];

    if (nodeType) {
      retNode.color = nodeType.color;
    }

    return retNode;
  });

  return retArr;
}

function setCanvas() {
  if (graphDom == null) return;

  graphDom
    .nodeLabel('label')
    .height(props.height ?? undefined)
    .width(props.width ?? undefined)
    .backgroundColor(props.backgroundColor ?? null)
    .dagMode(props.dagMode)
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
    .nodeRelSize(props.nodeRelSize ?? 1)
    .nodeCanvasObject(props.nodeCanvasObject)
    .nodeCanvasObjectMode(props.nodeCanvasObjectMode)
    .nodePointerAreaPaint(props.nodePointerAreaPaint);

  if (props.forceCenter !== undefined) graphDom?.d3Force('center', props.forceCenter());
  if (props.forceLink !== undefined) graphDom?.d3Force('link', props.forceLink());
  if (props.forceCollision !== undefined) graphDom?.d3Force('collide', props.forceCollision());
}
</script>

<template>
  <div id="parentDiv">
    <div ref="elementRef" class="visualization" />
  </div>
</template>

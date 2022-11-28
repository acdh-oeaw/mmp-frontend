<script lang="ts" setup>
import type { forceCenter, forceCollide, forceLink } from 'd3';
import ForceGraph, { type ForceGraphInstance, type GraphData as ForceGraphData } from 'force-graph';
import { onMounted, onUnmounted, ref, watch } from 'vue';

import type { GraphData } from '@/lib/network-graph/network-graph.types';
import { useElementDimensions } from '@/lib/use-element-dimensions';

const props = defineProps<{
  backgroundColor?: string;
  graph: GraphData;
  forceCenter?: typeof forceCenter;
  forceLink?: typeof forceLink;
  forceCollision?: typeof forceCollide;
  linkDirectionalArrowLength?: number;
  linkDirectionalArrowRelPos?: number;
  linkDirectionalParticles?: number;
  linkDirectionalParticleSpeed?: number;
  linkDirectionalParticleWidth?: number;
  linkWidth?: string;
  nodeCanvasObject?: Parameters<ForceGraphInstance['nodeCanvasObject']>[0];
  nodeCanvasObjectMode?: Parameters<ForceGraphInstance['nodeCanvasObjectMode']>[0];
  nodePointerAreaPaint?: Parameters<ForceGraphInstance['nodePointerAreaPaint']>[0];
  onNodeClick?: Parameters<ForceGraphInstance['onNodeClick']>[0];
  onNodeDrag?: Parameters<ForceGraphInstance['onNodeDrag']>[0];
  onNodeDragEnd?: Parameters<ForceGraphInstance['onNodeDragEnd']>[0];
  nodeRelSize?: number;
  onSimulationEnd?: Parameters<ForceGraphInstance['onEngineStop']>[0];
  onSimulationTick?: Parameters<ForceGraphInstance['onEngineTick']>[0];
  refresh?: number; // FIXME: this is the renderkey
  autoPauseRedraw?: boolean;
  width?: number;
  height?: number;
  zoomToFit?: boolean;
}>();

const elementRef = ref<HTMLDivElement | null>(null);
const dimensions = useElementDimensions(elementRef);

const forceGraph = ForceGraph()
  .nodeLabel('label')
  .height(props.height)
  .width(props.width)
  .backgroundColor(props.backgroundColor)
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
  .graphData(createGraphData(props.graph || { nodes: [], edges: [] }))
  // .d3Force('collide', d3.forceCollide().radius((d) => d.val + 20).iterations(3))
  .nodeRelSize(props.nodeRelSize ?? 1)
  .nodeCanvasObject(props.nodeCanvasObject)
  .nodeCanvasObjectMode(props.nodeCanvasObjectMode)
  .nodePointerAreaPaint(props.nodePointerAreaPaint);

if (props.forceCenter !== undefined) forceGraph?.d3Force('center', props.forceCenter());
if (props.forceLink !== undefined) forceGraph?.d3Force('link', props.forceLink());
if (props.forceCollision !== undefined) forceGraph?.d3Force('collide', props.forceCollision());

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  forceGraph(elementRef.value!);
});

onUnmounted(() => {
  forceGraph._destructor();
});

watch(dimensions, (dimensions) => {
  if (dimensions == null) return;

  forceGraph.width(dimensions.width).height(dimensions.height);
});

watch(
  () => props.graph,
  (graph) => {
    forceGraph.graphData(createGraphData(graph));
  }
);

watch(
  () => props.refresh,
  () => {
    forceGraph.d3ReheatSimulation();
  }
);

watch(
  () => props.zoomToFit,
  () => {
    forceGraph.zoomToFit(500);
  }
);

function createGraphData(obj: GraphData): ForceGraphData {
  const sorted = {
    nodes: [...obj.nodes].sort((a, b) => b.val - a.val),
    links: obj.edges,
  };
  return sorted;
}
</script>

<template>
  <div ref="elementRef" data-graph="" />
</template>

<style>
[data-graph] {
  display: grid;
  width: 100%;
  height: 100%;
}

[data-graph] .force-graph-container .graph-tooltip {
  font-size: 12px;
  font-family: 'Roboto FlexVariable', system-ui, sans-serif;
  text-align: center;
}
</style>

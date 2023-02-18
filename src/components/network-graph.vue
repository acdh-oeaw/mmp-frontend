<script lang="ts" setup>
import { type ForceGraphInstance, type LinkObject, type NodeObject } from "force-graph";
import { onMounted, onUnmounted, ref, watch } from "vue";

import { debounce } from "@/lib/debounce";
import { getEdgeColor } from "@/lib/network-graph/get-edge-color";
import { getNodeColor } from "@/lib/network-graph/get-node-color";
import {
	type NetworkGraphData,
	type NetworkGraphNode,
} from "@/lib/network-graph/network-graph.types";
import { paintNode } from "@/lib/network-graph/paint-node";

interface NetworkGraphContext {
	graph: ForceGraphInstance | null;
}

const props = defineProps<{
	graph: NetworkGraphData;
	height: number;
	selectedKeys: Set<NetworkGraphNode["key"]>;
	width: number;
}>();

const emit = defineEmits<{
	(event: "node-click", node: NetworkGraphNode | null): void;
	(event: "node-hover", node: NetworkGraphNode | null): void;
	(event: "ready", forceGraph: ForceGraphInstance): void;
}>();

const context: NetworkGraphContext = {
	graph: null,
};

const elementRef = ref<HTMLElement | null>(null);

onMounted(async () => {
	if (elementRef.value == null) return;

	/** `force-graph` assumes `window` global. */
	const ForceGraph = await import("force-graph").then((module) => {
		return module.default;
	});

	context.graph = ForceGraph();
	context.graph.width(props.width);
	context.graph.height(props.height);

	context.graph.nodeId("key");
	context.graph.nodeLabel("label");
	context.graph.linkLabel("label");

	const nodes = Array.from(props.graph.nodes.values()) as Array<NodeObject>;
	const links = Array.from(props.graph.edges.values()) as Array<LinkObject>;
	context.graph.graphData({ links, nodes });

	// context.graph.nodeVisibility((node) => {
	// 	if (props.selectedNodes.size === 0) return true;
	// 	if (props.selectedNodes.has(node.key)) return true;
	// 	for (const key of node.neighbors) {
	// 		if (props.selectedNodes.has(key)) return true;
	// 	}
	// 	return false;
	// });

	context.graph.nodeColor(getNodeColor);
	context.graph.linkColor(getEdgeColor);

	// context.graph.nodeCanvasObjectMode(() => {
	// 	return "replace";
	// });
	context.graph.nodeCanvasObject(paintNode);
	// context.nodePointerAreaPaint(getNodePaintArea)

	context.graph.onNodeClick((node) => {
		emit("node-click", node as NetworkGraphNode);
	});
	context.graph.onNodeHover((node) => {
		emit("node-hover", node as NetworkGraphNode);
	});

	context.graph.onNodeDragEnd((node) => {
		node.fx = node.x;
		node.fy = node.y;
	});

	// context.graph.d3Force("charge")?.["strength"](-100);

	context.graph(elementRef.value);

	emit("ready", context.graph);
});

const resize = debounce((width: number, height: number) => {
	if (context.graph == null) return;

	context.graph.width(width);
	context.graph.height(height);
});

watch(
	[
		() => {
			return props.width;
		},
		() => {
			return props.height;
		},
	],
	([width, height]) => {
		resize(width, height);
	},
);

watch(
	() => {
		return props.graph;
	},
	(data) => {
		if (context.graph == null) return;

		const nodes = Array.from(data.nodes.values()) as Array<NodeObject>;
		const links = Array.from(data.edges.values()) as Array<LinkObject>;
		context.graph.graphData({ links, nodes });
	},
);

onUnmounted(() => {
	context.graph?._destructor();
});
</script>

<template>
	<div ref="elementRef" class="absolute inset-0 grid" data-network-graph>
		<slot :context="context" />
	</div>
</template>

<style>
[data-network-graph] .force-graph-container .graph-tooltip {
	font-size: 0.75rem;
}
</style>

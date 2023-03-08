<script lang="ts" setup>
import { groupByToMap } from "@stefanprobst/group-by";
import { type ForceCenter, type ForceLink, type ForceManyBody } from "d3";
import { type ForceGraphInstance, type LinkObject, type NodeObject } from "force-graph";
import { nextTick, onMounted, onUnmounted, provide, ref, watch } from "vue";

import { debounce } from "@/lib/debounce";
import { key } from "@/lib/network-graph/network-graph.context";
import {
	type NetworkGraphContext,
	type NetworkGraphData,
	type NetworkGraphNode,
} from "@/lib/network-graph/network-graph.types";

const props = defineProps<{
	graph: NetworkGraphData;
	height: number;
	highlightedKeys: Set<NetworkGraphNode["key"]>;
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

function updateAuthorNodePositions(nodes: Array<NodeObject>) {
	// TODO: pass this in via props? (may make sense to also display node count by kind/keyword type in the legend)
	/** Use fixed positions for author nodes. */
	const grouped = groupByToMap(nodes, (node) => {
		return node.kind;
	});

	const authorNodes = grouped.get("autor");

	if (authorNodes != null && authorNodes.length > 1) {
		const radius = Math.min(props.width, props.height) * 0.3;
		const rad = (2 * Math.PI) / authorNodes.length;

		authorNodes.forEach((node, index) => {
			node.fx = Math.cos(rad * index) * radius;
			node.fy = Math.sin(rad * index) * radius;
		});
	}
}

function updateGraph() {
	const nodes = Array.from(props.graph.nodes.values()) as Array<NodeObject>;
	const links = Array.from(props.graph.edges.values()) as Array<LinkObject>;

	updateAuthorNodePositions(nodes);

	context.graph?.graphData({ links, nodes });
}

onMounted(async () => {
	if (elementRef.value == null) return;

	/** `force-graph` assumes `window` global. */
	const { default: ForceGraph } = await import("force-graph");

	context.graph = ForceGraph();
	context.graph.width(props.width);
	context.graph.height(props.height);
	context.graph.backgroundColor("transparent");

	context.graph.minZoom(0.25);
	context.graph.maxZoom(10);

	context.graph.nodeId("key");
	context.graph.nodeLabel("label");
	context.graph.linkLabel("label");

	context.graph.nodeVisibility((node) => {
		// if (props.showNeighborsOnly !== true) return true
		if (props.selectedKeys.size === 0) return true;
		if (props.selectedKeys.has(node.key)) return true;
		for (const key of node.neighbors) {
			if (props.selectedKeys.has(key)) return true;
		}
		return false;
	});
	context.graph.linkVisibility((edge) => {
		if (props.selectedKeys.size === 0) return true;
		// @ts-expect-error At this point `d3` has replaced `source` with `NodeObject`.
		const source = edge.source.key;
		// @ts-expect-error At this point `d3` has replaced `target` with `NodeObject`.
		const target = edge.target.key;
		if (props.selectedKeys.has(source)) return true;
		if (props.selectedKeys.has(target)) return true;
		return false;
	});

	context.graph.nodeColor("color");
	context.graph.linkColor("color");
	// context.graph.linkWidth("count");
	// context.graph.linkDirectionalParticles(1)
	// context.graph.linkDirectionalParticleWidth(1.7)

	context.graph.nodeCanvasObjectMode(() => {
		return "replace";
	});
	context.graph.nodeCanvasObject(function paintNode(node, ctx, globalScale) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const x = node.x!;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const y = node.y!;
		const label = node.label;
		const color = node.color;

		// FIXME:
		// const fontSize = (Math.log2(node.neighbors.size || 1) + 18) / globalScale;
		const fontSize = 14 / globalScale;
		ctx.font = `${fontSize}px 'Roboto FlexVariable', ui-sans-serif, system-ui, sans-serif`;

		const textWidth = ctx.measureText(label).width;
		const dimensions = [textWidth, fontSize].map((n) => {
			return n + fontSize * /** padding */ 0.2;
		}) as [number, number];
		const [width, height] = dimensions;

		ctx.fillStyle = "hsl(0deg 0% 100% / 75%)";
		ctx.fillRect(x - width / 2, y - height / 2, width, height);

		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		//
		ctx.fillStyle = color;
		ctx.fillText(label, x, y);
		// FIXME:
		// if (props.selectedKeys.has(node.id)) {
		// 	ctx.shadowColor = node.color;
		// 	ctx.shadowBlur = 15;
		// 	ctx.fillStyle = "#f1f5fa";
		// 	ctx.strokeStyle = node.color;
		// 	ctx.lineWidth = 2 / globalScale;
		// } else {
		// 	ctx.fillStyle = node.color;
		// 	ctx.strokeStyle = "#f1f5fa";
		// 	ctx.lineWidth = 1.7 / globalScale;
		// }
		// ctx.strokeText(label, x, y);
		// ctx.fillText(label, x, y);
		// ctx.shadowBlur = 0;
		//

		node.__pointerAreaPaint = dimensions;
	});
	context.graph.nodePointerAreaPaint(function getNodePaintArea(node, color, ctx) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const x = node.x!;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const y = node.y!;

		ctx.fillStyle = color;

		const area = node.__pointerAreaPaint;

		if (area != null) {
			const [width, height] = area;
			ctx.fillRect(x - width / 2, y - height / 2, width, height);
		}
	});

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

	const _linkForce = context.graph.d3Force("link") as ForceLink<
		NodeObject,
		Required<LinkObject>
	> | null;
	// _linkForce?.strength((link) => {
	// 	const source = link.source;
	// 	assert(typeof source === "object");
	// 	if (source.kind === "autor") {
	// 		return 0.7;
	// 	}
	// 	return 0;
	// });

	const _chargeForce = context.graph.d3Force("charge") as ForceManyBody<NodeObject> | null;
	// chargeForce?.strength(-100);

	const _centerForce = context.graph.d3Force("center") as ForceCenter<NodeObject> | null;
	// context.graph.d3Force("center", null);

	// context.graph.autoPauseRedraw(false);
	updateGraph();
	context.graph(elementRef.value);

	emit("ready", context.graph);
});

const resize = debounce((width: number, height: number) => {
	if (context.graph == null) return;

	nextTick(() => {
		updateAuthorNodePositions(Array.from(props.graph.nodes.values()) as Array<NodeObject>);

		context.graph?.width(width);
		context.graph?.height(height);
	});
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

watch(() => {
	return props.graph;
}, updateGraph);

onUnmounted(() => {
	context.graph?._destructor();
});

provide(key, context);
</script>

<template>
	<div ref="elementRef" class="absolute inset-0 grid" data-network-graph />
	<slot :context="context" />
</template>

<style>
[data-network-graph] .force-graph-container .graph-tooltip {
	font-size: 0.75rem;
}
</style>

<script lang="ts" setup>
import { assert } from "@acdh-oeaw/lib";
import { groupByToMap } from "@acdh-oeaw/lib";
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
import { type SelectionKey } from "@/lib/search/selection-key";
import { useSearchFilters } from "@/lib/search/use-search-filters";

const props = defineProps<{
	graph: NetworkGraphData;
	height: number;
	highlightedKeys: Set<SelectionKey>;
	selectedKeys: Set<SelectionKey>;
	width: number;
}>();

const emit = defineEmits<{
	(event: "node-click", node: NetworkGraphNode | null): void;
	(event: "node-hover", node: NetworkGraphNode | null): void;
	(event: "ready", forceGraph: ForceGraphInstance): void;
}>();

const { searchFilters } = useSearchFilters();

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
	context.graph.linkColor("dark-grey");
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

		const fontSize = 14 / globalScale;
		ctx.font = `${fontSize}px 'Roboto Flex Variable', ui-sans-serif, system-ui, sans-serif`;

		const textWidth = ctx.measureText(label).width;
		const dimensions = [textWidth, fontSize].map((n) => {
			return n + fontSize * /** padding */ 0.2;
		}) as [number, number];
		const [width, height] = dimensions;

		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		//
		if (props.selectedKeys.has(node.key)) {
			ctx.globalAlpha = 0.75;
			ctx.fillStyle = color;
			const w = width * 1.25;
			const h = height * 1.125;

			/** Firefox does not yet support `roundRect`. */
			if ("roundRect" in ctx) {
				const radius = 4 / globalScale;
				ctx.beginPath();
				ctx.roundRect(x - w / 2, y - h / 2, w, h, radius);
				ctx.fill();
			} else {
				// @ts-expect-error See above.
				ctx.fillRect(x - w / 2, y - h / 2, w, h);
			}

			ctx.globalAlpha = 1;

			ctx.fillStyle = "#f8fafc";
			ctx.fillText(label, x, y);
		} else {
			ctx.fillStyle = "hsl(0deg 0% 100% / 75%)";
			ctx.fillRect(x - width / 2, y - height / 2, width, height);

			ctx.fillStyle = color;
			ctx.fillText(label, x, y);
		}

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

	const _chargeForce = context.graph.d3Force("charge") as ForceManyBody<NodeObject> | null;
	// chargeForce?.strength(-100);

	let _centerForce = context.graph.d3Force("center") as ForceCenter<NodeObject> | null;
	// context.graph.d3Force("center", null);

	if (searchFilters.value.author.length >= 2) {
		_linkForce?.strength((link) => {
			const source = link.source;
			assert(typeof source === "object");
			if (source.kind === "autor") {
				return 0.7;
			}
			return 0;
		});

		_centerForce?.strength(0);
	}

	context.graph.autoPauseRedraw(false);
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

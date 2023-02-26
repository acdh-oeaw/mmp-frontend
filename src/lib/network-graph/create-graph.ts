import type { GraphData } from "@/api";
import { getEdgeColor } from "@/lib/network-graph/get-edge-color";
import { getNodeColor } from "@/lib/network-graph/get-node-color";
import type { NetworkGraphData } from "@/lib/network-graph/network-graph.types";

export function createGraph(data: GraphData): NetworkGraphData {
	const graph: NetworkGraphData = { nodes: new Map(), edges: new Map() };

	data.nodes.forEach((node) => {
		graph.nodes.set(node.key, {
			...node,
			// TODO: helper fn
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			label: node.label.split(", [")[0]!,
			color: getNodeColor(node),
			neighbors: new Set(),
		});
	});

	data.edges.forEach((edge) => {
		graph.edges.set(edge.key, {
			...edge,
			color: getEdgeColor(edge),
		});

		graph.nodes.get(edge.source)?.neighbors.add(edge.target);
		graph.nodes.get(edge.target)?.neighbors.add(edge.source);
	});

	return graph;
}

import type { ForceGraphInstance } from "force-graph";

import type { GraphEdge, GraphNode } from "@/api";

export type NetworkGraphNode = GraphNode & {
	color: string;
	neighbors: Set<GraphNode["key"]>;
	__pointerAreaPaint?: [number, number];
};

export type NetworkGraphEdge = GraphEdge & {
	color: string;
};

export interface NetworkGraphData {
	nodes: Map<NetworkGraphNode["key"], NetworkGraphNode>;
	edges: Map<NetworkGraphEdge["key"], NetworkGraphEdge>;
}

export interface NetworkGraphContext {
	graph: ForceGraphInstance | null;
}

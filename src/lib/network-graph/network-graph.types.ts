import type { GraphEdge, GraphNode } from "@/api";

export type NetworkGraphNode = GraphNode & {
	neighbors: Set<GraphNode["key"]>;
	__pointerAreaPaint?: [number, number];
};

export type NetworkGraphEdge = GraphEdge;

export interface NetworkGraphData {
	nodes: Map<NetworkGraphNode["key"], NetworkGraphNode>;
	edges: Map<NetworkGraphEdge["key"], NetworkGraphEdge>;
}

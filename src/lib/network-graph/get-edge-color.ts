import { type GraphEdge } from "@/api";
import { edgeColor } from "@/lib/network-graph/network-graph.config";

export function getEdgeColor(_edge: GraphEdge) {
	return edgeColor;
}

import { type LinkObject } from "force-graph";

import { edgeColor } from "@/lib/network-graph/network-graph.config";

export function getEdgeColor(_edge: LinkObject) {
	return edgeColor;
}

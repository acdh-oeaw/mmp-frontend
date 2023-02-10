import { assert } from "@stefanprobst/assert";
import { type NodeObject } from "force-graph";

import { keywordNodeColors, nodeColors } from "@/lib/network-graph/network-graph.config";

export function getNodeColor(node: NodeObject) {
	if (node.kind === "keyword") {
		assert(node.type);
		return keywordNodeColors[node.type];
	}

	return nodeColors[node.kind];
}

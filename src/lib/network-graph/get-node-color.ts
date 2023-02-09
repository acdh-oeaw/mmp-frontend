import type { GraphNode } from '@/api';
import { keywordNodeColors, nodeColors } from '@/lib/network-graph/network-graph.config';

export function getNodeColor(node: GraphNode) {
	if (node.kind === 'keyword') {
		return keywordNodeColors[node.type];
	}

	return nodeColors[node.kind];
}

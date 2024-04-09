import { type KeywordType } from "@/api";
import {
	type NetworkGraphEdge,
	type NetworkGraphNode,
} from "@/lib/network-graph/network-graph.types";

declare module "force-graph" {
	interface NodeObject {
		key: NetworkGraphNode["key"];
		// id: NetworkGraphNode["id"];
		kind: NetworkGraphNode["kind"];
		type?: KeywordType;
		label: NetworkGraphNode["label"];
		color: NetworkGraphNode["color"];
		neighbors: NetworkGraphNode["neighbors"];
		__pointerAreaPaint: NetworkGraphNode["__pointerAreaPaint"];
	}

	interface LinkObject {
		key: NetworkGraphEdge["key"];
		// source: NetworkGraphNode | NetworkGraphNode["key"];
		// target: NetworkGraphNode | NetworkGraphNode["key"];
		// label: NetworkGraphEdge["label"];
		color: NetworkGraphEdge["color"];
		count: NetworkGraphEdge["count"];
	}
}

import { createBlob } from "@/lib/create-blob";
import { downloadFile } from "@/lib/download-file";
import { type NetworkGraphData } from "@/lib/network-graph/network-graph.types";

function saveAsImage(element: HTMLElement) {
	const canvas = element.querySelector("canvas");
	canvas?.toBlob((blob) => {
		if (blob) {
			downloadFile(blob, "graph.png");
		}
	}, "image/png");
}

function saveAsJson(graph: NetworkGraphData) {
	const blob = createBlob(
		JSON.stringify(
			{
				nodes: Array.from(graph.nodes),
				edges: Array.from(graph.edges),
			},
			null,
			2,
		),
		"application/json",
	);
	downloadFile(blob, "graph.json");
}

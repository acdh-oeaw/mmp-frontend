import { pick } from "@acdh-oeaw/lib";

import { createBlob } from "@/lib/create-blob";
import { downloadFile } from "@/lib/download-file";
import { type NetworkGraphData } from "@/lib/network-graph/network-graph.types";

export function saveAsImage(element: HTMLElement) {
	const canvas = element.querySelector("canvas");
	canvas?.toBlob((blob) => {
		if (blob) {
			downloadFile(blob, "graph.png");
		}
	}, "image/png");
}

export function saveAsCsv(graph: NetworkGraphData) {
	const headings = ["Key", "Label", "Kind", "Type", "Neighbors"].join(",");

	function sanitize(value: string) {
		return value.replace(",", " ");
	}

	const rows: Array<string> = [];

	graph.nodes.forEach((node) => {
		const neighbors: Array<string> = [];

		node.neighbors.forEach((key) => {
			const neighbor = graph.nodes.get(key);
			if (neighbor != null) {
				neighbors.push(sanitize(neighbor.label));
			}
		});

		const row = [
			node.key,
			sanitize(node.label),
			node.kind,
			"type" in node ? node.type : "",
			neighbors.join("/"),
		].join(",");

		rows.push(row);
	});

	const csv = [headings, rows].join("\n");
	const blob = createBlob(csv, "text/csv");
	downloadFile(blob, "graph.csv");
}

export function saveAsGexf(graph: NetworkGraphData) {
	return Promise.all([import("graphology"), import("graphology-gexf/browser")]).then(
		([{ DirectedGraph }, { write }]) => {
			const _graph = new DirectedGraph();

			graph.nodes.forEach((_node) => {
				// @ts-expect-error Missing keys added by `d3-force`.
				const node = pick(_node, ["label", "kind", "type", "x", "y", "color"]);
				_graph.addNode(_node.key, node);
			});
			graph.edges.forEach((_edge) => {
				// FIXME: there must be a better way
				/** `d3-force` replaces string ids with object references on init. */
				// @ts-expect-error Mutated by `d3`.
				const source = typeof _edge.source === "string" ? _edge.source : _edge.source.key;
				// @ts-expect-error Mutated by `d3`.
				const target = typeof _edge.target === "string" ? _edge.target : _edge.target.key;
				const edge = pick(_edge, ["count", "color"]);
				_graph.addEdgeWithKey(_edge.key, source, target, edge);
			});

			const xml = write(_graph);
			const blob = createBlob(xml, "application/xml");
			downloadFile(blob, "graph.gexf");
		},
	);
}

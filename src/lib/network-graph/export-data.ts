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
	const json = JSON.stringify(
		{ nodes: Array.from(graph.nodes), edges: Array.from(graph.edges) },
		null,
		2,
	);
	const blob = createBlob(json, "application/json");
	downloadFile(blob, "graph.json");
}

function saveAsCsv(graph: NetworkGraphData) {
	const headings = ["ID", "Label", "Kind", "Type", "Neighbors"].join(",");

	function sanitize(value: string) {
		return value.replace(",", " ");
	}

	interface CsvRow {
		id: number;
		label: string;
		kind: string;
		type: string;
		neighbors: string;
	}

	const rows: Array<CsvRow> = [];

	graph.nodes.forEach((node) => {
		const neighbors: Array<string> = [];

		node.neighbors.forEach((key) => {
			const neighbor = graph.nodes.get(key);
			if (neighbor != null) {
				neighbors.push(sanitize(neighbor.label));
			}
		});

		const row: CsvRow = {
			id: node.id,
			label: sanitize(node.label),
			kind: node.kind,
			type: "type" in node ? node.type : "",
			neighbors: neighbors.join("/"),
		};

		rows.push(row);
	});

	const csv = [headings, rows].join("\n");
	const blob = createBlob(csv, "text/csv");
	downloadFile(blob, "graph.csv");
}

function saveAsGexf(graph: NetworkGraphData) {
	return Promise.all([import("graphology"), import("graphology-gexf/browser")]).then(
		([{ DirectedGraph }, { write }]) => {
			const _graph = new DirectedGraph();

			graph.nodes.forEach((node) => {
				_graph.addNode(node.key, node);
			});
			graph.edges.forEach((edge) => {
				_graph.addEdgeWithKey(edge.key, edge.source, edge.target, edge);
			});

			const xml = write(_graph);
			const blob = createBlob(xml, "application/xml");
			downloadFile(blob, "graph.gexf");
		},
	);
}

import { type CanvasCustomRenderFn, type NodeObject } from "force-graph";

import { getNodeColor } from "@/lib/network-graph/get-node-color";

export const paintNode: CanvasCustomRenderFn<NodeObject> = function paintNode(
	node,
	ctx,
	globalScale,
) {
	if (node.x == null || node.y == null) return;

	const label = node.label;
	const fontSize = 14 / globalScale;
	ctx.font = `${fontSize}px 'Roboto FlexVariable', ui-sans-serif, system-ui, sans-serif`;
	const textWidth = ctx.measureText(label).width;
	const bckgDimensions = [textWidth, fontSize].map((n) => {
		return n + fontSize * 0.2 /** padding */;
	}) as [number, number];

	ctx.fillStyle = "hsl(0deg 0% 100% / 75%)";
	ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = getNodeColor(node);
	ctx.fillText(label, node.x, node.y);

	node.__pointerAreaPaint = bckgDimensions;
};

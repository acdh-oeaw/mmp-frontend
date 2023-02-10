export function nodeCanvasObject(node, ctx, globalScale) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const x = node.x!;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const y = node.y!;
	const label = node.label;

	const fontSize = ((Math.log2(node.neighbors.size) || 1) + 10) / globalScale;
	ctx.font = `${fontSize}px 'Roboto FlexVariable', ui-sans-serif, system-ui, sans-serif`;

	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	const textWidth = ctx.measureText(label).width;
	const [width, height] = [textWidth, fontSize].map((n) => {
		return n + fontSize * /** padding */ 0.2;
	}) as [number, number];

	const color = getNodeColor(node);

	if (props.selectedNodes.has(node.key)) {
		ctx.shadowColor = color;
		ctx.shadowBlur = 15;

		ctx.lineWidth = 2 / globalScale;
		ctx.strokeStyle = color;
		ctx.strokeText(label, x, y);

		ctx.fillStyle = edgeColors.muted;
		ctx.fillText(label, x, y);

		ctx.shadowBlur = 0;
	} else {
		ctx.lineWidth = 1.75 / globalScale;
		ctx.strokeStyle = edgeColors.muted;
		ctx.strokeText(label, x, y);

		ctx.fillStyle = color;
		ctx.fillText(label, x, y);
	}

	node.__pointerAreaPaint = [width, height];
}

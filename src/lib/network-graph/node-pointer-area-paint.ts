export function nodePointerAreaPaint(node, color, ctx) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const x = node.x!;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const y = node.y!;

	ctx.fillStyle = color;

	const area = node.__pointerAreaPaint;

	if (area != null) {
		const [width, height] = area;
		ctx.fillRect(x - width / 2, y - height / 2, width, height);
	}
}

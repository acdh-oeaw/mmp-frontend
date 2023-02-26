export function createKey(...segments: Array<number | string>): string {
	return segments.join("+");
}

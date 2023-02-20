export function createBlob(content: string, mimeType: string): Blob {
	const blob = new Blob([content], { type: mimeType });
	return blob;
}

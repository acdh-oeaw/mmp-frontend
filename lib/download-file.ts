export function downloadFile(blob: Blob, fileName: string): void {
	const objectUrl = URL.createObjectURL(blob);

	const anchor = document.createElement("a");
	anchor.setAttribute("download", fileName);
	anchor.setAttribute("href", objectUrl);
	anchor.click();

	anchor.remove();
	URL.revokeObjectURL(objectUrl);
}

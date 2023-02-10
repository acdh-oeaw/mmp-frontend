import type { KeywordType, ResourceKind } from "@/api";

export const nodeColors: Record<ResourceKind, string> = {
	autor: "#ff5858" /** red */,
	stelle: "#9e9e9e" /** grey */,
	keyword: "#9e9e9e" /** grey */,
	usecase: "#9e9e9e" /** grey */,
	ort: "#9e9e9e" /** grey */,
	text: "#9e9e9e" /** grey */,
};

export const keywordNodeColors: Record<KeywordType, string> = {
	Keyword: "#039be5" /** blue darken-1 */,
	Ethnonym: "#00897b" /** teal darken-1 */,
	Name: "#ffb300" /** amber darken-1 */,
	Region: "#43a047" /** green darken-1 */,
	unclear: "#9e9e9e" /** grey */,
};

export const edgeColor = "#e8e8e8";

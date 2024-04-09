import type { KeywordType, ResourceKind } from "@/api";

export const nodeColors: Record<ResourceKind, string> = {
	autor: "#ff5858",
	stelle: "#9e9e9e",
	keyword: "#9e9e9e",
	usecase: "#9e9e9e",
	ort: "#9e9e9e",
	text: "#9e9e9e",
};

export const keywordNodeColors: Record<KeywordType, string> = {
	Keyword: "#039be5",
	Ethnonym: "#00897b",
	Name: "#ffb300",
	Region: "#43a047",
	unclear: "#9e9e9e",
};

export const edgeColor = "#e8e8e8";

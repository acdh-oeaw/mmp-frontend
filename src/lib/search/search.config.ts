import type { KeywordType, ResourceKind } from "@/api";

export const kindLabels: Record<ResourceKind, Plurals> = {
	autor: { one: "Author", other: "Authors" },
	usecase: { one: "Case study", other: "Case studies" },
	keyword: { one: "Keyword", other: "Keywords" },
	ort: { one: "Place", other: "Places" },
	stelle: { one: "Passage", other: "Passages" },
	text: { one: "Text", other: "Texts" },
};

export const keywordTypeLabels: Record<KeywordType, Plurals> = {
	Ethnonym: { one: "Ethnonym", other: "Ethnonyms" },
	Keyword: { one: "Keyword", other: "Keywords" },
	Name: { one: "Personal name", other: "Personal names" },
	Region: { one: "Place name", other: "Place names" },
	unclear: { one: "unclear", other: "unclear" },
};

export const colors: Record<ResourceKind, string> = {
	autor: "bg-red-300",
	stelle: "bg-sky-300",
	keyword: "bg-blue-300",
	usecase: "bg-amber-300",
	ort: "bg-green-300",
	text: "bg-purple-300",
};

export const keywordColors: Record<KeywordType, string> = {
	Keyword: "bg-blue-300",
	Ethnonym: "bg-sky-300",
	Name: "bg-amber-300",
	Region: "bg-green-300",
	unclear: "bg-neutral-300",
};

// https://github.com/acdh-oeaw/mmp/blob/master/archiv/endpoint_views.py#L17
// The date range mentioned in the link above only affects the keyword by century endpoint, the earliest archived text in the database was written 199 BCE, which means this can and should stay the same
export const minYear = -1000;
export const maxYear = 1500;

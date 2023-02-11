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
	Name: { one: "Name", other: "Names" },
	Region: { one: "Region", other: "Regions" },
	unclear: { one: "unclear", other: "unclear" },
};

export const colors: Record<ResourceKind, string> = {
	autor: "bg-red-500",
	stelle: "bg-teal-500",
	keyword: "bg-blue-500",
	usecase: "bg-amber-500",
	ort: "bg-green-500",
	text: "bg-purple-500",
};

export const keywordColors: Record<KeywordType, string> = {
	Keyword: "bg-blue-500",
	Ethnonym: "bg-teal-500",
	Name: "bg-amber-500",
	Region: "bg-green-500",
	unclear: "bg-grey-500",
};

// https://github.com/acdh-oeaw/mmp/blob/master/archiv/endpoint_views.py#L17
export const minYear = -300;
export const maxYear = 1500;

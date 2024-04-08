import { type ComputedRef, computed } from "vue";
import type { LocationQuery } from "vue-router";

import type { Author, CaseStudy, Keyword, Passage, Place, SkosConcept } from "@/api";
import { isNonEmptyString } from "@/lib/is-nonempty-string";
import { getResourceIds } from "@/lib/search/get-resource-ids";
import { getLimit, getOffset } from "@/lib/search/pagination";
import { defaultLimit } from "@/lib/search/pagination.config";
import { maxYear, minYear } from "@/lib/search/search.config";
import { unique } from "@/lib/unique";
import { useRoute, useRouter } from "#imports";

export const queryModes = ["intersection", "union"] as const;
export type QueryMode = (typeof queryModes)[number];

export const dataSets = ["case-studies", "gens", "all"] as const;
export type DataSet = (typeof dataSets)[number];

export const dateFilters = ["composition", "content"] as const;
export type DateFilter = (typeof dateFilters)[number];

export type SearchFilters = {
	author: Array<Author["id"]>;
	"case-study": Array<CaseStudy["id"]>;
	keyword: Array<Keyword["id"]>;
	passage: Array<Passage["id"]>;
	place: Array<Place["id"]>;
	"date-range": number | [number, number];
	"date-filter": DateFilter;
	dataset: DataSet;
	"query-mode": QueryMode;
	"text-genre": Array<SkosConcept["id"]>;
	limit: number;
	offset: number;
};

type UseSearchFiltersResult = {
	searchFilters: ComputedRef<SearchFilters>;
	setSearchFilters: (searchFilters: SearchFilters) => void;
	createSearchFilterParams: (searchFilters: SearchFilters) => LocationQuery;
	defaultSearchFilters: SearchFilters;
};

export const defaultSearchFilters = Object.freeze({
	author: [],
	"case-study": [],
	keyword: [],
	passage: [],
	place: [],
	"date-range": [minYear, maxYear],
	"date-filter": "composition",
	dataset: "all",
	"query-mode": "intersection",
	"text-genre": [],
	limit: defaultLimit,
	offset: 0,
} satisfies SearchFilters);

export function useSearchFilters(): UseSearchFiltersResult {
	const router = useRouter();
	const route = useRoute();

	const searchFilters = computed<SearchFilters>(() => {
		const searchFilters: SearchFilters = {
			author: getResourceIds(route.query["author"]),
			/**
			 * There's an asymmetry in search filter handling, because it is allowed
			 * to set multiple "case-study" filters via search params, but the
			 * separate `/case-studies/:id` routes *also* set "case-study" to the route param.
			 */
			"case-study": route.path.startsWith("/case-studies")
				? [Number(route.params["id"])]
				: getResourceIds(route.query["case-study"]),
			keyword: getResourceIds(route.query["keyword"]),
			passage: getResourceIds(route.query["passage"]),
			place: getResourceIds(route.query["place"]),
			"date-range": getDateRange(route.query["date-range"]),
			"date-filter": getDateFilter(route.query["date-filter"]),
			dataset: getDataSet(route.query["dataset"]),
			"query-mode": getQueryMode(route.query["query-mode"]),
			"text-genre": getResourceIds(route.query["text-genre"]),
			limit: getLimit(route.query["limit"]),
			offset: getOffset(route.query["offset"]),
		};

		return searchFilters;
	});

	function setSearchFilters(searchFilters: SearchFilters) {
		const query = createSearchFilterParams(searchFilters);
		void router.push({ query });
	}

	return {
		searchFilters,
		setSearchFilters,
		createSearchFilterParams,
		defaultSearchFilters,
	};
}

//

function isValidNumber(value: number) {
	return !Number.isNaN(value) && value >= minYear && value <= maxYear;
}

function getDateRange(param: LocationQuery[string] | undefined) {
	const values = Array.isArray(param) ? param : [param ?? null];
	const numbers = values
		.filter(isNonEmptyString)
		.map(Number)
		.filter(isValidNumber)
		.sort((a, z) => {
			return a - z;
		});
	if (numbers.length === 0) return defaultSearchFilters["date-range"];
	if (numbers.length === 1) return numbers[0] as number;
	if (numbers.length === 2) return numbers as [number, number];
	return defaultSearchFilters["date-range"];
}

function isDataSet(value: string): value is DataSet {
	return dataSets.includes(value as DataSet);
}

function getDataSet(param: LocationQuery[string] | undefined) {
	const value = Array.isArray(param) ? param[0] : param;
	if (value == null) return defaultSearchFilters["dataset"];
	if (isDataSet(value)) return value;
	return defaultSearchFilters["dataset"];
}

function isQueryMode(value: string): value is QueryMode {
	return queryModes.includes(value as QueryMode);
}

function getQueryMode(param: LocationQuery[string] | undefined) {
	const value = Array.isArray(param) ? param[0] : param;
	if (value == null) return defaultSearchFilters["query-mode"];
	if (isQueryMode(value)) return value;
	return defaultSearchFilters["query-mode"];
}

function isDateFilter(value: string): value is DateFilter {
	return dateFilters.includes(value as DateFilter);
}

function getDateFilter(param: LocationQuery[string] | undefined) {
	const value = Array.isArray(param) ? param[0] : param;
	if (value == null) return defaultSearchFilters["date-filter"];
	if (isDateFilter(value)) return value;
	return defaultSearchFilters["date-filter"];
}

function createSearchFilterParams(searchFilters: SearchFilters): LocationQuery {
	const searchParams: LocationQuery = {};

	if (searchFilters["author"].length > 0) {
		searchParams["author"] = unique(searchFilters["author"]).map(String);
	}

	if (searchFilters["case-study"].length > 0) {
		searchParams["case-study"] = unique(searchFilters["case-study"]).map(String);
	}

	if (searchFilters["keyword"].length > 0) {
		searchParams["keyword"] = unique(searchFilters["keyword"]).map(String);
	}

	if (searchFilters["passage"].length > 0) {
		searchParams["passage"] = unique(searchFilters["passage"]).map(String);
	}

	if (searchFilters["place"].length > 0) {
		searchParams["place"] = unique(searchFilters["place"]).map(String);
	}

	if (Array.isArray(searchFilters["date-range"])) {
		if (
			searchFilters["date-range"][0] !== defaultSearchFilters["date-range"][0] ||
			searchFilters["date-range"][1] !== defaultSearchFilters["date-range"][1]
		) {
			searchParams["date-range"] = searchFilters["date-range"].map(String);
		}
	} else {
		searchParams["date-range"] = String(searchFilters["date-range"]);
	}

	if (searchFilters["date-filter"] !== defaultSearchFilters["date-filter"]) {
		searchParams["date-filter"] = searchFilters["date-filter"];
	}

	if (searchFilters["dataset"] !== defaultSearchFilters["dataset"]) {
		searchParams["dataset"] = searchFilters["dataset"];
	}

	if (searchFilters["query-mode"] !== defaultSearchFilters["query-mode"]) {
		searchParams["query-mode"] = searchFilters["query-mode"];
	}

	if (searchFilters["text-genre"].length > 0) {
		searchParams["text-genre"] = unique(searchFilters["text-genre"]).map(String);
	}

	if (searchFilters["limit"] !== defaultSearchFilters["limit"]) {
		searchParams["limit"] = String(searchFilters["limit"]);
	}

	if (searchFilters["offset"] !== defaultSearchFilters["offset"]) {
		searchParams["offset"] = String(searchFilters["offset"]);
	}

	return searchParams;
}

import { type ComputedRef, computed } from "vue";
import type { LocationQuery } from "vue-router";

import { getLimit, getOffset } from "@/lib/search/pagination";
import { defaultLimit } from "@/lib/search/pagination.config";
import { useRoute, useRouter } from "#imports";

export type SearchFilters = {
	searchTerm: string;
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
	searchTerm: "",
	limit: defaultLimit,
	offset: 0,
} satisfies SearchFilters);

export function useBrowseSearchFilters(): UseSearchFiltersResult {
	const router = useRouter();
	const route = useRoute();

	const searchFilters = computed<SearchFilters>(() => {
		const searchFilters: SearchFilters = {
			searchTerm: getSearchTerm(route.query["q"]),
			limit: getLimit(route.query["limit"]),
			offset: getOffset(route.query["offset"]),
		};

		return searchFilters;
	});

	function setSearchFilters(searchFilters: SearchFilters) {
		const query = createSearchFilterParams(searchFilters);
		router.push({ query });
	}

	return {
		searchFilters,
		setSearchFilters,
		createSearchFilterParams,
		defaultSearchFilters,
	};
}

function getSearchTerm(param: LocationQuery[string] | undefined) {
	const value = Array.isArray(param) ? param[0] : param;
	if (value == null) return defaultSearchFilters.searchTerm;
	return value.trim();
}

function createSearchFilterParams(searchFilters: SearchFilters): LocationQuery {
	const searchParams: LocationQuery = {};

	if (searchFilters["searchTerm"] !== defaultSearchFilters["searchTerm"]) {
		searchParams["q"] = searchFilters["searchTerm"].trim();
	}

	if (searchFilters["limit"] !== defaultSearchFilters["limit"]) {
		searchParams["limit"] = String(searchFilters["limit"]);
	}

	if (searchFilters["offset"] !== defaultSearchFilters["offset"]) {
		searchParams["offset"] = String(searchFilters["offset"]);
	}

	return searchParams;
}

import { computed, type ComputedRef } from "vue";
import type { LocationQuery } from "vue-router";

import type { Author, Keyword } from "@/api";
import { getResourceIds } from "@/lib/search/get-resource-ids";
import { getLimit, getOffset } from "@/lib/search/pagination";
import { defaultLimit } from "@/lib/search/pagination.config";
import { unique } from "@/lib/unique";
import { useRoute, useRouter } from "#imports";

export interface SearchFilters {
	author: Array<Author["id"]>;
	keyword: Array<Keyword["id"]>;
	limit: number;
	offset: number;
}

interface UseSearchFiltersResult {
	searchFilters: ComputedRef<SearchFilters>;
	setSearchFilters: (searchFilters: SearchFilters) => void;
	createSearchFilterParams: (searchFilters: SearchFilters) => LocationQuery;
	defaultSearchFilters: SearchFilters;
}

export const defaultSearchFilters = Object.freeze({
	author: [],
	keyword: [],
	limit: defaultLimit,
	offset: 0,
} satisfies SearchFilters);

export function useCaseStudiesSearchFilters(): UseSearchFiltersResult {
	const router = useRouter();
	const route = useRoute();

	const searchFilters = computed<SearchFilters>(() => {
		const searchFilters: SearchFilters = {
			author: getResourceIds(route.query.author),
			keyword: getResourceIds(route.query.keyword),
			limit: getLimit(route.query.limit),
			offset: getOffset(route.query.offset),
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

function createSearchFilterParams(searchFilters: SearchFilters): LocationQuery {
	const searchParams: LocationQuery = {};

	if (searchFilters.author.length > 0) {
		searchParams.author = unique(searchFilters.author).map(String);
	}

	if (searchFilters.keyword.length > 0) {
		searchParams.keyword = unique(searchFilters.keyword).map(String);
	}

	if (searchFilters.limit !== defaultSearchFilters.limit) {
		searchParams.limit = String(searchFilters.limit);
	}

	if (searchFilters.offset !== defaultSearchFilters.offset) {
		searchParams.offset = String(searchFilters.offset);
	}

	return searchParams;
}

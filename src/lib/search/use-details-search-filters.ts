import { type ComputedRef, computed } from "vue";
import type { LocationQuery } from "vue-router";

import type { Resource } from "@/api";
import { getResourceIds } from "@/lib/search/get-resource-ids";
import { unique } from "@/lib/unique";
import { useRoute, useRouter } from "#imports";

export const kinds = ["author", "keyword", "passage", "place", "spatial-coverage"] as const;
export type DetailKind = (typeof kinds)[number];

export type SearchFilters = {
	"detail-id": Array<Resource["id"]>;
	"detail-kind": DetailKind | null;
};

type UseSearchFiltersResult = {
	searchFilters: ComputedRef<SearchFilters>;
	setSearchFilters: (searchFilters: SearchFilters) => void;
	createSearchFilterParams: (searchFilters: SearchFilters) => LocationQuery;
	defaultSearchFilters: SearchFilters;
};

export const defaultSearchFilters = Object.freeze({
	"detail-id": [],
	"detail-kind": null,
} satisfies SearchFilters);

export function useDetailsSearchFilters(): UseSearchFiltersResult {
	const router = useRouter();
	const route = useRoute();

	const searchFilters = computed<SearchFilters>(() => {
		const searchFilters: SearchFilters = {
			"detail-kind": getDetailKind(route.query["detail-kind"]),
			"detail-id": getResourceIds(route.query["detail-id"]),
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

//

function isDetailKind(value: unknown): value is DetailKind {
	return kinds.includes(value as DetailKind);
}

function getDetailKind(param: LocationQuery[string] | undefined) {
	const value = Array.isArray(param) ? param[0] : param;
	if (value == null) return defaultSearchFilters["detail-kind"];
	if (isDetailKind(value)) return value;
	return defaultSearchFilters["detail-kind"];
}

function createSearchFilterParams(searchFilters: SearchFilters): LocationQuery {
	const searchParams: LocationQuery = {};

	if (searchFilters["detail-kind"] != null) {
		searchParams["detail-kind"] = searchFilters["detail-kind"];
	}

	if (searchFilters["detail-id"].length > 0) {
		searchParams["detail-id"] = unique(searchFilters["detail-id"]).map(String);
	}

	return searchParams;
}

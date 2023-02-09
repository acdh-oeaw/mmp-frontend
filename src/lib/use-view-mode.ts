import { type ComputedRef, computed } from "vue";
import type { LocationQuery } from "vue-router";

import { useRoute, useRouter } from "#imports";

type ViewMode = "fullscreen" | "normal";

type SearchFilters = {
	"view-mode": ViewMode;
};

type UseSearchFiltersResult = {
	searchFilters: ComputedRef<SearchFilters>;
	setSearchFilters: (searchFilters: SearchFilters) => void;
	createSearchFilterParams: (searchFilters: SearchFilters) => LocationQuery;
	defaultSearchFilters: SearchFilters;
};

export const defaultSearchFilters = Object.freeze({
	"view-mode": "normal",
} satisfies SearchFilters);

export function useViewMode(): UseSearchFiltersResult {
	const router = useRouter();
	const route = useRoute();

	const searchFilters = computed(() => {
		const searchFilters: SearchFilters = {
			"view-mode": route.query["view-mode"] === "fullscreen" ? "fullscreen" : "normal",
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

function createSearchFilterParams(searchFilters: SearchFilters): LocationQuery {
	const searchParams: LocationQuery = {};

	if (searchFilters["view-mode"] === "fullscreen") {
		searchParams["view-mode"] = searchFilters["view-mode"];
	}

	return searchParams;
}

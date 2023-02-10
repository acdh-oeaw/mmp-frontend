import { type ComputedRef, computed } from "vue";
import type { LocationQuery } from "vue-router";

import { type ResourceKey } from "@/api";
import { getResourceKeys } from "@/lib/search/get-resource-keys";
import { unique } from "@/lib/unique";
import { useRoute, useRouter } from "#imports";

export type Selection = {
	selection: Array<ResourceKey>;
};

type UseSelectionResult = {
	selection: ComputedRef<Selection>;
	setSelection: (searchFilters: Selection) => void;
	createSelectionParams: (searchFilters: Selection) => LocationQuery;
	defaultSelection: Selection;
};

export const defaultSelection = Object.freeze({
	selection: [],
} satisfies Selection);

export function useSelection(): UseSelectionResult {
	const router = useRouter();
	const route = useRoute();

	const selection = computed<Selection>(() => {
		const searchFilters: Selection = {
			selection: getResourceKeys(route.query["selection"]),
		};

		return searchFilters;
	});

	function setSelection(searchFilters: Selection) {
		const query = createSelectionParams(searchFilters);
		router.push({ query });
	}

	return {
		selection,
		setSelection,
		createSelectionParams,
		defaultSelection,
	};
}

//

function createSelectionParams(searchFilters: Selection): LocationQuery {
	const searchParams: LocationQuery = {};

	if (searchFilters["selection"].length > 0) {
		searchParams["selection"] = unique(searchFilters["selection"]).map(String);
	}

	return searchParams;
}

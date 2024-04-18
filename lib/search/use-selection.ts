import { computed, type ComputedRef } from "vue";
import type { LocationQuery } from "vue-router";

import { getSelectionKeys, type SelectionKey } from "@/lib/search/selection-key";
import { unique } from "@/lib/unique";
import { useRoute, useRouter } from "#imports";

export interface Selection {
	selection: Array<SelectionKey>;
}

interface UseSelectionResult {
	selection: ComputedRef<Selection>;
	setSelection: (searchFilters: Selection) => void;
	createSelectionParams: (searchFilters: Selection) => LocationQuery;
	defaultSelection: Selection;
}

export const defaultSelection = Object.freeze({
	selection: [],
} satisfies Selection);

export function useSelection(): UseSelectionResult {
	const router = useRouter();
	const route = useRoute();

	const selection = computed<Selection>(() => {
		const searchFilters: Selection = {
			selection: getSelectionKeys(route.query.selection),
		};

		return searchFilters;
	});

	function setSelection(searchFilters: Selection) {
		const query = createSelectionParams(searchFilters);
		void router.push({ query });
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

	if (searchFilters.selection.length > 0) {
		searchParams.selection = unique(searchFilters.selection).map(String);
	}

	return searchParams;
}

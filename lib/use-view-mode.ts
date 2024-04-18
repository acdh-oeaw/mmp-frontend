import { computed, type ComputedRef } from "vue";
import type { LocationQuery } from "vue-router";

import { useRoute, useRouter } from "#imports";

type ViewMode = "fullscreen" | "normal";

interface ViewModes {
	"view-mode": ViewMode;
}

interface UseViewModesResult {
	viewMode: ComputedRef<ViewModes>;
	setViewModes: (viewMode: ViewModes) => void;
	createViewModeParams: (viewMode: ViewModes) => LocationQuery;
	defaultViewModes: ViewModes;
}

export const defaultViewModes = Object.freeze({
	"view-mode": "normal",
} satisfies ViewModes);

export function useViewMode(): UseViewModesResult {
	const router = useRouter();
	const route = useRoute();

	const viewMode = computed(() => {
		const viewMode: ViewModes = {
			"view-mode": route.query["view-mode"] === "fullscreen" ? "fullscreen" : "normal",
		};

		return viewMode;
	});

	function setViewModes(viewMode: ViewModes) {
		const query = createViewModeParams(viewMode);
		void router.push({ query });
	}

	return {
		viewMode,
		setViewModes,
		createViewModeParams,
		defaultViewModes,
	};
}

//

function createViewModeParams(viewMode: ViewModes): LocationQuery {
	const searchParams: LocationQuery = {};

	if (viewMode["view-mode"] === "fullscreen") {
		searchParams["view-mode"] = viewMode["view-mode"];
	}

	return searchParams;
}

import { computed } from "vue";

import { useViewMode } from "@/lib/use-view-mode";

export function useFullScreen() {
	const { searchFilters } = useViewMode();

	const isFullScreen = computed(() => {
		return searchFilters.value["view-mode"] === "fullscreen";
	});

	return isFullScreen;
}

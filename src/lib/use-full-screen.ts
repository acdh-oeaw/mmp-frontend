import { computed } from "vue";

import { useViewMode } from "@/lib/use-view-mode";

export function useFullScreen() {
	const { viewMode } = useViewMode();

	const isFullScreen = computed(() => {
		return viewMode.value["view-mode"] === "fullscreen";
	});

	return isFullScreen;
}

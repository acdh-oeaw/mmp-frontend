import { ref } from "vue";

import type { KeywordType, ResourceKind } from "@/api";

export function useNetworkGraphFilters() {
	const resourceKindFilters = ref(
		new Map<ResourceKind, boolean>([
			["autor", true],
			["keyword", true],
		]),
	);

	function onToggleResourceKindFilter(filter: ResourceKind, isVisible: boolean) {
		resourceKindFilters.value.set(filter, isVisible);
	}

	const keywordTypeFilters = ref(
		new Map<KeywordType, boolean>([
			["Ethnonym", true],
			["Keyword", true],
			["Name", true],
			["Region", true],
		]),
	);

	function onToggleKeywordTypeFilter(filter: KeywordType, isVisible: boolean) {
		keywordTypeFilters.value.set(filter, isVisible);
	}

	return {
		resourceKindFilters,
		onToggleResourceKindFilter,
		keywordTypeFilters,
		onToggleKeywordTypeFilter,
	};
}

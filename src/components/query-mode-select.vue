<script lang="ts" setup>
import { computed } from "vue";

import SingleSelect from "@/components/single-select.vue";
import { type QueryMode, queryModes, useSearchFilters } from "@/lib/search/use-search-filters";

const label = "Query mode";

const labels: Record<QueryMode, { label: string; description?: string }> = {
	intersection: {
		label: "Intersection",
		description: "Show results which contain all search terms",
	},
	union: {
		label: "Union",
		description: "Show results which contain any search term",
	},
};

const items = queryModes.map((key) => {
	return { ...labels[key], key };
});

const { searchFilters, setSearchFilters } = useSearchFilters();
const selectedKey = computed<QueryMode>(() => {
	return searchFilters.value["query-mode"];
});

function onChangeSelection(selectedKey: string) {
	setSearchFilters({ ...searchFilters.value, "query-mode": selectedKey as QueryMode, offset: 0 });
}
</script>

<template>
	<SingleSelect
		:items="items"
		:label="label"
		name="query-mode"
		:selected-key="selectedKey"
		@change-selection="onChangeSelection"
	/>
</template>

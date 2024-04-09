<script lang="ts" setup>
import { computed } from "vue";

import SingleSelect from "@/components/single-select.vue";
import { type DateFilter, dateFilters, useSearchFilters } from "@/lib/search/use-search-filters";

const label = "Date filter";

const labels: Record<DateFilter, { label: string; description?: string }> = {
	composition: {
		label: "Time of composition",
		description: "Time-frame in which the text was written",
	},
	content: {
		label: "Temporal coverage",
		description: "Time-frame of events referred to",
	},
};

const items = dateFilters.map((key) => {
	return { ...labels[key], key };
});

const { searchFilters, setSearchFilters } = useSearchFilters();
const selectedKey = computed<DateFilter>(() => {
	return searchFilters.value["date-filter"];
});

function onChangeSelection(selectedKey: string) {
	setSearchFilters({ ...searchFilters.value, "date-filter": selectedKey as DateFilter, offset: 0 });
}
</script>

<template>
	<SingleSelect
		:items="items"
		:label="label"
		name="date-filter"
		:selected-key="selectedKey"
		@change-selection="onChangeSelection"
	/>
</template>

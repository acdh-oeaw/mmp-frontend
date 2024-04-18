<script lang="ts" setup>
import { computed } from "vue";

import SingleSelect from "@/components/single-select.vue";
import { type DataSet, dataSets, useSearchFilters } from "@/lib/search/use-search-filters";

const label = "Dataset";

const labels: Record<DataSet, { label: string; description?: string }> = {
	all: {
		label: "All datasets",
	},
	"case-studies": {
		label: "Case studies only",
	},
	gens: {
		label: "GENS database",
	},
};

const items = dataSets.map((key) => {
	return { ...labels[key], key };
});

const { searchFilters, setSearchFilters } = useSearchFilters();
const selectedKey = computed<DataSet>(() => {
	return searchFilters.value.dataset;
});

function onChangeSelection(selectedKey: string) {
	setSearchFilters({ ...searchFilters.value, dataset: selectedKey as DataSet, offset: 0 });
}
</script>

<template>
	<SingleSelect
		:items="items"
		:label="label"
		name="dataset"
		:selected-key="selectedKey"
		@change-selection="onChangeSelection"
	/>
</template>

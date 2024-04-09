<script lang="ts" setup>
import { computed } from "vue";

import RangeSlider from "@/components/range-slider.vue";
import Slider from "@/components/slider.vue";
import { debounce } from "@/lib/debounce";
import { maxYear, minYear } from "@/lib/search/search.config";
import { useSearchFilters } from "@/lib/search/use-search-filters";

const id = "date-range";
const name = "date-range";
const label = "Date range";

const { searchFilters, setSearchFilters } = useSearchFilters();
const dateRange = computed(() => {
	return searchFilters.value["date-range"];
});

function onChange(value: number | [number, number]) {
	setSearchFilters({ ...searchFilters.value, "date-range": value, offset: 0 });
}

const debouncedOnChange = debounce(onChange);
</script>

<template>
	<div class="-m-2 rounded p-2 transition hover:bg-neutral-100">
		<RangeSlider
			v-if="Array.isArray(dateRange)"
			:id="id"
			:label="label"
			:values="dateRange"
			:min="minYear"
			:max="maxYear"
			:name="name"
			:step="1"
			@change="debouncedOnChange"
		/>
		<Slider
			v-else
			:id="id"
			:label="label"
			:value="dateRange"
			:min="minYear"
			:max="maxYear"
			:name="name"
			:step="1"
			@change="debouncedOnChange"
		/>
	</div>
</template>

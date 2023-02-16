<script lang="ts" setup>
import { computed } from "vue";

import { type SearchFilters, useSearchFilters } from "@/lib/search/use-search-filters";

const props = defineProps<{
	caption?: string;
	type: string;
	filters: Pick<SearchFilters, "author" | "case-study" | "keyword" | "passage" | "place">;
}>();

const { defaultSearchFilters } = useSearchFilters();
const searchFilters = computed<SearchFilters>(() => {
	return { ...defaultSearchFilters, ...props.filters };
});
</script>

<template>
	<div>
		<p>THIS IS A PLACEHOLDER FOR A {{ props.type }} VISUALISATION</p>
		<pre>{{ searchFilters }}</pre>
	</div>
</template>

<script lang="ts" setup>
import { type SearchFilters } from "@/lib/search/use-search-filters";

const props = defineProps<{
	caption?: string;
	type: string;
	filters: Pick<SearchFilters, "author" | "case-study" | "keyword" | "passage" | "place">;
}>();
</script>

<template>
	<div>
		<p>THIS IS A TEST PLACEHOLDER</p>
		<pre>{{ props }}</pre>
	</div>
</template>

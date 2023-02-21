<script lang="ts" setup>
import { computed } from "vue";

import StoryEntityDetails from "@/components/story-entity-details.vue";
import StoryGeoMap from "@/components/story-geo-map.vue";
import StoryNetworkGraph from "@/components/story-network-graph.vue";
import StorySearchResults from "@/components/story-search-results.vue";
import StoryWordCloud from "@/components/story-word-cloud.vue";
import { type SearchFilters, useSearchFilters } from "@/lib/search/use-search-filters";

const storyComponentTypes = ["map", "graph", "cloud", "list", "detail"] as const;
type StoryComponentType = (typeof storyComponentTypes)[number];

function isStoryComponentType(value: string): value is StoryComponentType {
	return storyComponentTypes.includes(value as StoryComponentType);
}

const props = defineProps<{
	caption: string;
	type: string;
	filters: Pick<SearchFilters, "author" | "case-study" | "keyword" | "passage" | "place">;
}>();

const { defaultSearchFilters } = useSearchFilters();
const searchFilters = computed<SearchFilters>(() => {
	return { ...defaultSearchFilters, ...props.filters };
});
</script>

<template>
	<figure v-if="isStoryComponentType(props.type)">
		<div class="relative h-96 w-full">
			<StoryNetworkGraph v-if="props.type === 'graph'" :search-filters="searchFilters" />
			<StoryGeoMap v-if="props.type === 'map'" :search-filters="searchFilters" />
			<StoryWordCloud v-if="props.type === 'cloud'" :search-filters="searchFilters" />
			<StorySearchResults v-if="props.type === 'list'" :search-filters="searchFilters" />
			<StoryEntityDetails v-if="props.type === 'detail'" :search-filters="searchFilters" />
		</div>
		<figcaption v-if="props.caption">{{ props.caption }}</figcaption>
	</figure>
</template>

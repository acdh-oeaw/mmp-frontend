<script lang="ts" setup>
import { computed } from "vue";

import StoryEntityDetails from "@/components/story-entity-details.vue";
import StoryGeoMap from "@/components/story-geo-map.vue";
import StoryNetworkGraph from "@/components/story-network-graph.vue";
import StorySearchResults from "@/components/story-search-results.vue";
import StoryTokenWordClouds from "@/components/story-token-word-clouds.vue";
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
		<div class="not-prose">
			<div v-if="props.type === 'graph'" class="relative h-96 w-full">
				<StoryNetworkGraph :search-filters="searchFilters" />
			</div>
			<div v-if="props.type === 'map'" class="relative h-96 w-full">
				<StoryGeoMap :search-filters="searchFilters" />
			</div>
			<div v-if="props.type === 'cloud'" class="relative h-96 w-full">
				<StoryTokenWordClouds :search-filters="searchFilters" />
			</div>
			<div v-if="props.type === 'list'" class="relative max-h-96 w-full">
				<StorySearchResults :search-filters="searchFilters" />
			</div>
			<div v-if="props.type === 'detail'" class="relative max-h-96 w-full">
				<StoryEntityDetails :search-filters="searchFilters" />
			</div>
		</div>
		<figcaption v-if="props.caption">{{ props.caption }}</figcaption>
	</figure>
</template>

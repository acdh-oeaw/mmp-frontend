<script lang="ts" setup>
import AuthorDetails from "@/components/author-details.vue";
// import KeywordDetails from "@/components/keyword-details.vue";
import PassageDetails from "@/components/passage-details.vue";
import PlaceDetails from "@/components/place-details.vue";
// import TextDetails from "@/components/text-details.vue";
import { type SearchFilters } from "@/lib/search/use-search-filters";

const props = defineProps<{
	searchFilters: SearchFilters;
}>();
</script>

<template>
	<div class="relative h-full w-full">
		<AuthorDetails
			v-if="'author' in props.searchFilters"
			:ids="new Set(props.searchFilters.author)"
		/>
		<!-- <KeywordDetails
				v-if="'keyword' in props.searchFilters"
				:ids="new Set(props.searchFilters.keyword)"
			/> -->
		<PassageDetails
			v-if="'passage' in props.searchFilters"
			:ids="new Set(props.searchFilters.passage)"
		/>
		<PlaceDetails v-if="'place' in props.searchFilters" :ids="new Set(props.searchFilters.place)" />
		<!-- <TextDetails
				v-if="'text' in props.searchFilters"
				:ids="new Set(props.searchFilters.text)"
			/> -->
	</div>
</template>

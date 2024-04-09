<script lang="ts" setup>
import { computed } from "vue";

import AuthorDetails from "@/components/author-details.vue";
import KeywordDetails from "@/components/keyword-details.vue";
import PassageDetails from "@/components/passage-details.vue";
import PlaceDetails from "@/components/place-details.vue";
import SideDialog from "@/components/side-dialog.vue";
import TextDetails from "@/components/text-details.vue";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelectionByKind } from "@/lib/search/use-selection-by-kind";
import { useRouter } from "#imports";

const router = useRouter();

const { createSearchFilterParams, searchFilters } = useSearchFilters();
const selectionByKind = useSelectionByKind();

const isSidePanelVisible = computed(() => {
	return (
		selectionByKind.value.has("autor") ||
		selectionByKind.value.has("keyword") ||
		selectionByKind.value.has("ort") ||
		selectionByKind.value.has("stelle") ||
		selectionByKind.value.has("text")
	);
});

function onToggle() {
	void router.push({ query: createSearchFilterParams(searchFilters.value) });
}
</script>

<template>
	<SideDialog :open="isSidePanelVisible" @toggle="onToggle">
		<AuthorDetails v-if="selectionByKind.has('autor')" :ids="selectionByKind.get('autor')!" />
		<KeywordDetails
			v-else-if="selectionByKind.has('keyword')"
			:ids="selectionByKind.get('keyword')!"
		/>
		<PassageDetails
			v-else-if="selectionByKind.has('stelle')"
			:ids="selectionByKind.get('stelle')!"
		/>
		<PlaceDetails v-else-if="selectionByKind.has('ort')" :ids="selectionByKind.get('ort')!" />
		<TextDetails v-else-if="selectionByKind.has('text')" :ids="selectionByKind.get('text')!" />
	</SideDialog>
</template>

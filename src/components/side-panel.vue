<script lang="ts" setup>
import { computed } from "vue";

import { type Resource, type ResourceKind } from "@/api";
import AuthorDetails from "@/components/author-details.vue";
import KeywordDetails from "@/components/keyword-details.vue";
import PassageDetails from "@/components/passage-details.vue";
import PlaceDetails from "@/components/place-details.vue";
import SideDialog from "@/components/side-dialog.vue";
import SideDisclosure from "@/components/side-disclosure.vue";
import { splitResourceKey } from "@/lib/search/resource-key";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { useRouter } from "#imports";

const router = useRouter();

const { createSearchFilterParams, searchFilters } = useSearchFilters();
const { selection } = useSelection();

const idsByKind = computed(() => {
	const grouped = new Map<ResourceKind, Set<Resource["id"]>>();

	selection.value.selection.forEach((key) => {
		const { kind, id } = splitResourceKey(key);

		if (grouped.has(kind)) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			grouped.get(kind)!.add(id);
		} else {
			grouped.set(kind, new Set([id]));
		}
	});

	return grouped;
});

const isSideDisclosureVisible = computed(() => {
	return idsByKind.value.has("keyword");
});

const isSidePanelVisible = computed(() => {
	return (
		idsByKind.value.has("autor") || idsByKind.value.has("stelle") || idsByKind.value.has("ort")
	);
});

function onToggle() {
	// TODO: only update search params after transitionend
	router.push({ query: createSearchFilterParams(searchFilters.value) });
}
</script>

<template>
	<SideDisclosure :open="isSideDisclosureVisible" @toggle="onToggle">
		<KeywordDetails v-if="idsByKind.has('keyword')" :ids="idsByKind.get('keyword')!" />
	</SideDisclosure>
	<SideDialog :open="isSidePanelVisible" @toggle="onToggle">
		<AuthorDetails v-if="idsByKind.has('autor')" :ids="idsByKind.get('autor')!" />
		<PassageDetails v-else-if="idsByKind.has('stelle')" :ids="idsByKind.get('stelle')!" />
		<PlaceDetails v-else-if="idsByKind.has('ort')" :ids="idsByKind.get('ort')!" />
	</SideDialog>
</template>

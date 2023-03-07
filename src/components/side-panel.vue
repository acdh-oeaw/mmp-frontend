<script lang="ts" setup>
import { computed } from "vue";

import { type Resource, type ResourceKind } from "@/api";
import AuthorDetails from "@/components/author-details.vue";
import KeywordDetails from "@/components/keyword-details.vue";
import PassageDetails from "@/components/passage-details.vue";
import PlaceDetails from "@/components/place-details.vue";
import SideDialog from "@/components/side-dialog.vue";
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

const isVisible = computed(() => {
	return idsByKind.value.size > 0;
});

function onToggle() {
	// TODO: only update search params after transitionend
	router.push({ query: createSearchFilterParams(searchFilters.value) });
}
</script>

<template>
	<SideDialog :open="isVisible" @toggle="onToggle">
		<AuthorDetails v-if="idsByKind.has('autor')" :ids="idsByKind.get('autor')!" />
		<KeywordDetails v-else-if="idsByKind.has('keyword')" :ids="idsByKind.get('keyword')!" />
		<PassageDetails v-else-if="idsByKind.has('stelle')" :ids="idsByKind.get('stelle')!" />
		<PlaceDetails v-else-if="idsByKind.has('ort')" :ids="idsByKind.get('ort')!" />
	</SideDialog>
</template>

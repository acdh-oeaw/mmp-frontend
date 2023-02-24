<script lang="ts" setup>
import { computed } from "vue";

import { type Resource, type ResourceKind } from "@/api";
import AuthorDetails from "@/components/author-details.vue";
import KeywordDetails from "@/components/keyword-details.vue";
import PassageDetails from "@/components/passage-details.vue";
import PlaceDetails from "@/components/place-details.vue";
import { splitResourceKey } from "@/lib/search/resource-key";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { NuxtLink } from "#components";

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
</script>

<template>
	<div
		class="fixed inset-y-0 left-0 w-full max-w-md overflow-hidden rounded-r-md bg-white py-8 shadow-lg transition"
		:class="isVisible ? 'visible translate-x-0' : 'invisible -translate-x-full'"
	>
		<aside class="grid h-full grid-rows-[auto_1fr]">
			<header class="relative px-8">
				<NuxtLink :href="{ query: createSearchFilterParams(searchFilters) }">
					<span>Close</span>
				</NuxtLink>
			</header>
			<div class="overflow-auto">
				<AuthorDetails v-if="idsByKind.has('autor')" :ids="idsByKind.get('autor')!" />
				<KeywordDetails v-if="idsByKind.has('keyword')" :ids="idsByKind.get('keyword')!" />
				<PassageDetails v-if="idsByKind.has('stelle')" :ids="idsByKind.get('stelle')!" />
				<PlaceDetails v-if="idsByKind.has('ort')" :ids="idsByKind.get('ort')!" />
			</div>
		</aside>
	</div>
</template>

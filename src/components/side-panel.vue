<script lang="ts" setup>
import { XMarkIcon } from "@heroicons/vue/24/outline";
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
	<div v-if="idsByKind.has('keyword')" class="fixed inset-0 right-auto overflow-y-auto">
		<div class="flex min-h-full">
			<Transition
				as="template"
				enter="duration-300 ease-out"
				enter-from="-translate-x-full"
				enter-to="translate-x-0"
				leave="duration-200 ease-in"
				leave-from="translate-x-0"
				leave-to="-translate-x-full"
			>
				<DialogPanel class="grid w-full max-w-md content-start gap-8 rounded bg-white py-8">
					<div class="justify-self-end px-8">
						<button class="flex gap-1" @click="onToggle">
							<XMarkIcon aria-hidden="true" class="h-6 w-6 transition hover:text-neutral-700" />
							<span class="sr-only">Close</span>
						</button>
					</div>
					<KeywordDetails :ids="idsByKind.get('keyword')!" />
				</DialogPanel>
			</Transition>
		</div>
	</div>
	<SideDialog v-else :open="isVisible" @toggle="onToggle">
		<AuthorDetails v-if="idsByKind.has('autor')" :ids="idsByKind.get('autor')!" />
		<PassageDetails v-else-if="idsByKind.has('stelle')" :ids="idsByKind.get('stelle')!" />
		<PlaceDetails v-else-if="idsByKind.has('ort')" :ids="idsByKind.get('ort')!" />
	</SideDialog>
</template>

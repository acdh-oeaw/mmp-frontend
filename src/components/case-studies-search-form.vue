<script lang="ts" setup>
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import { computed, ref, watch } from "vue";

import { type GetAutoComplete, useAutoComplete } from "@/api";
import SearchAutocomplete from "@/components/search-autocomplete.vue";
import SearchAutocompleteLoadingItem from "@/components/search-autocomplete-loading-item.vue";
import type { SearchFilters } from "@/lib/case-studies/use-case-studies-search-filters";
import { useCaseStudiesSearchFilters } from "@/lib/case-studies/use-case-studies-search-filters";
import { debounce } from "@/lib/debounce";
import { createSearchFilterKey } from "@/lib/search/create-case-studies-search-filter-key";
import { createResourceKey, splitResourceKey } from "@/lib/search/resource-key";
import type { Item } from "@/lib/search/search.types";
import { useRouter } from "#imports";

const router = useRouter();
const { createSearchFilterParams, searchFilters } = useCaseStudiesSearchFilters();

function onSubmit() {
	const nextSearchFilters: SearchFilters = {
		...searchFilters.value,
		author: [],
		keyword: [],
		offset: 0,
	};

	selectedKeys.value.forEach((key) => {
		const { kind, id } = splitResourceKey(key);
		const filter = createSearchFilterKey(kind);
		nextSearchFilters[filter].push(id);
	});

	router.push({ query: createSearchFilterParams(nextSearchFilters) });
}

const onDebouncedSubmit = debounce(onSubmit);

//

const selectedKeys = ref<Array<Item["key"]>>([]);
const searchTerm = ref("");

watch(
	searchFilters,
	() => {
		selectedKeys.value = [
			...searchFilters.value["author"].map((id) => {
				return createResourceKey({ kind: "autor", id });
			}),
			...searchFilters.value["keyword"].map((id) => {
				return createResourceKey({ kind: "keyword", id });
			}),
		];
	},
	{ immediate: true },
);

function onChangeSelection(value: Array<Item["key"]>) {
	selectedKeys.value = value;
	/**
	 * We cannot use `<form @change>` because `headlessui` uses `<input type="hidden">`,
	 * which don't fire change events.
	 */
	onDebouncedSubmit();
}

function onChangeSearchTerm(value: string) {
	searchTerm.value = value;
}

//

// TODO: debounce search term change

const searchParams = computed<GetAutoComplete.SearchParams>(() => {
	return {
		kind: ["autor", "keyword"],
		/** Return 10 results per `kind`. Note that results will be sorted by `kind`. */
		page_size: 10,
		q: searchTerm.value.trim(),
	};
});

const autoCompleteQuery = useAutoComplete(searchParams);
const isFetching = computed(() => {
	return autoCompleteQuery.isFetching.value;
});
const isLoading = computed(() => {
	return autoCompleteQuery.isInitialLoading.value;
});
const items = computed(() => {
	return autoCompleteQuery.data.value?.results ?? [];
});

//
</script>

<template>
	<form
		class="relative grid grid-cols-[1fr_auto] gap-4 rounded-lg bg-white p-4 shadow-lg"
		novalidate
		role="search"
		@submit.prevent="onSubmit"
	>
		<div class="grid items-center gap-4">
			<SearchAutocomplete
				:items="items"
				name="case-studies-search-autocomplete"
				:search-term="searchTerm"
				:selected-keys="selectedKeys"
				:status="isFetching ? 'fetching' : isLoading ? 'loading' : 'idle'"
				@change-selection="onChangeSelection"
				@change-search-term="onChangeSearchTerm"
			>
				<template #loading-item="{ loadItem: onLoadItem, id, kind }">
					<SearchAutocompleteLoadingItem :id="id" :kind="kind" @load-item="onLoadItem" />
				</template>
			</SearchAutocomplete>
		</div>

		<button class="flex items-center gap-2 p-4" type="submit">
			<span class="sr-only">Search</span>
			<MagnifyingGlassIcon class="h-6 w-6" />
		</button>
	</form>
</template>

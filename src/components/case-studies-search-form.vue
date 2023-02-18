<script lang="ts" setup>
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import { computed, ref, watch } from "vue";

import { type GetAutoComplete, useAutoComplete } from "@/api";
import SearchAutocomplete from "@/components/search-autocomplete.vue";
import SearchAutocompleteLoadingItem from "@/components/search-autocomplete-loading-item.vue";
import { debounce } from "@/lib/debounce";
import { createSearchFilterKey } from "@/lib/search/create-case-studies-search-filter-key";
import { createResourceKey, splitResourceKey } from "@/lib/search/resource-key";
import type { Item } from "@/lib/search/search.types";
import type { SearchFilters } from "@/lib/search/use-case-studies-search-filters";
import { useCaseStudiesSearchFilters } from "@/lib/search/use-case-studies-search-filters";

const { searchFilters, setSearchFilters } = useCaseStudiesSearchFilters();
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

	setSearchFilters(nextSearchFilters);
}

const debouncedSubmit = debounce(onSubmit);
watch(selectedKeys, debouncedSubmit);
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
			<span class="md:hidden">Search</span>
			<MagnifyingGlassIcon class="h-6 w-6" />
		</button>
	</form>
</template>

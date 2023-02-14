<script lang="ts" setup>
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import { computed, ref, watch } from "vue";

import { type GetAutoComplete, useAutoComplete } from "@/api";
import SearchAutocomplete from "@/components/search-autocomplete.vue";
import { createSearchFilterKey } from "@/lib/search/create-search-filter-key";
import { createResourceKey, splitResourceKey } from "@/lib/search/resource-key";
import type { Item } from "@/lib/search/search.types";
import type { SearchFilters } from "@/lib/search/use-search-filters";
import { useSearchFilters } from "@/lib/search/use-search-filters";
// import { usePassageSearchFormSelection } from '@/lib/search/use-search-form-selection';

const { searchFilters, setSearchFilters } = useSearchFilters();
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
			...searchFilters.value["passage"].map((id) => {
				return createResourceKey({ kind: "stelle", id });
			}),
			...searchFilters.value["place"].map((id) => {
				return createResourceKey({ kind: "ort", id });
			}),
			...searchFilters.value["case-study"].map((id) => {
				return createResourceKey({ kind: "usecase", id });
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

const searchParams = computed<GetAutoComplete.SearchParams>(() => {
	return {
		kind: ["autor", "keyword", "ort", "stelle", "usecase"],
		/** Return 10 results per `kind`. Note that results will be sorted by `kind`. */
		page_size: 10,
		q: searchTerm.value.trim(),
	};
});

const autoCompleteQuery = useAutoComplete(searchParams);
const _isFetching = computed(() => {
	return autoCompleteQuery.isFetching.value;
});
const _isLoading = computed(() => {
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
		"case-study": [],
		keyword: [],
		passage: [],
		place: [],
	};

	selectedKeys.value.forEach((key) => {
		const { kind, id } = splitResourceKey(key);
		const filter = createSearchFilterKey(kind);
		nextSearchFilters[filter].push(id);
	});

	setSearchFilters(nextSearchFilters);
}
</script>

<template>
	<form novalidate role="search" @submit.prevent="onSubmit">
		<SearchAutocomplete
			:items="items"
			:search-term="searchTerm"
			:selected-keys="selectedKeys"
			@change-selection="onChangeSelection"
			@change-search-term="onChangeSearchTerm"
		>
			<template #loading-item="{ loadItem: onLoadItem }">
				<!--  -->
			</template>
		</SearchAutocomplete>

		<button class="flex items-center gap-2" type="submit">
			<span class="md:hidden">Search</span>
			<MagnifyingGlassIcon class="h-6 w-6" />
		</button>
	</form>
</template>

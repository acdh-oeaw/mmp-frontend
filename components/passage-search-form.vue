<script lang="ts" setup>
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import { computed, ref, watch } from "vue";

import { type GetAutoComplete, useAutoComplete } from "@/api";
import DatasetSelect from "@/components/dataset-select.vue";
import DateFilterSelect from "@/components/date-filter-select.vue";
import DateRangeSlider from "@/components/date-range-slider.vue";
import QueryModeSelect from "@/components/query-mode-select.vue";
import SearchAutocomplete from "@/components/search-autocomplete.vue";
import SearchAutocompleteLoadingItem from "@/components/search-autocomplete-loading-item.vue";
import TextGenreSelect from "@/components/text-genre-select.vue";
import { debounce } from "@/lib/debounce";
import { createSearchFilterKey } from "@/lib/search/create-search-filter-key";
import { createResourceKey, splitResourceKey } from "@/lib/search/resource-key";
import type { Item } from "@/lib/search/search.types";
import type { SearchFilters } from "@/lib/search/use-search-filters";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { useRouter } from "#imports";

const router = useRouter();
const { createSearchFilterParams, searchFilters } = useSearchFilters();
const { createSelectionParams, selection } = useSelection();

function onSubmit() {
	const nextSearchFilters: SearchFilters = {
		...searchFilters.value,
		author: [],
		"case-study": [],
		keyword: [],
		passage: [],
		place: [],
		offset: 0,
	};

	selectedKeys.value.forEach((key) => {
		const { kind, id } = splitResourceKey(key);
		const filter = createSearchFilterKey(kind);
		nextSearchFilters[filter].push(id);
	});

	void router.push({
		query: {
			...createSearchFilterParams(nextSearchFilters),
			...createSelectionParams(selection.value),
		},
	});
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
		kind: ["autor", "keyword", "ort", "stelle", "usecase"],
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
				name="passage-search-autocomplete"
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

			<div class="grid items-center gap-4 lg:grid-cols-[auto_1fr]">
				<div class="grid items-center gap-4 lg:grid-cols-4">
					<DatasetSelect />
					<QueryModeSelect />
					<TextGenreSelect />
					<DateFilterSelect />
				</div>
				<DateRangeSlider />
			</div>
		</div>

		<button class="flex items-center gap-2 p-4" type="submit">
			<span class="sr-only">Search</span>
			<MagnifyingGlassIcon class="h-6 w-6" />
		</button>
	</form>
</template>

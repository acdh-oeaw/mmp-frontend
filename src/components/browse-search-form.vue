<script lang="ts" setup>
import { ref } from "vue";

import { useBrowseSearchFilters } from "@/lib/browse/use-browse-search-filters";
import { useRouter } from "#imports";

// TODO: dispatch search request when search term changes, or require submit button?

const label = "Search";
const placeholder = "Search...";

const { createSearchFilterParams, searchFilters } = useBrowseSearchFilters();
const searchTerm = ref(searchFilters.value["searchTerm"]);

function onChangeSearchTerm(event: Event) {
	const element = event.currentTarget as HTMLInputElement;
	const value = element.value;
	searchTerm.value = value;
}

//

const router = useRouter();

function onSubmit() {
	router.push({
		query: createSearchFilterParams({ ...searchFilters.value, searchTerm: searchTerm.value }),
	});
}
</script>

<template>
	<form
		class="relative grid grid-cols-[1fr_auto] gap-4 rounded-lg bg-white p-4 shadow-lg"
		novalidate
		role="search"
		@submit.prevent="onSubmit"
	>
		<div class="grid items-center gap-4">
			<label>
				<span class="sr-only">{{ label }}</span>
				<input
					autocomplete="off"
					class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-neutral-900 focus-visible:outline-none"
					:placeholder="placeholder"
					type="search"
					:value="searchTerm"
					@change="onChangeSearchTerm"
				/>
			</label>
		</div>

		<button class="flex items-center gap-2 p-4" type="submit">
			<span class="md:hidden">Search</span>
			<MagnifyingGlassIcon class="h-6 w-6" />
		</button>
	</form>
</template>

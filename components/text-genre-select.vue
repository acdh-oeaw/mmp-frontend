<script lang="ts" setup>
import { computed } from "vue";

import { useSkosConcepts } from "@/api";
import SingleSelect from "@/components/single-select.vue";
import { useSearchFilters } from "@/lib/search/use-search-filters";

const all = "_all_";

const label = "Text genre";

/** Text genres are collection id 1. */
const query = useSkosConcepts({ collection: 1 });
const items = computed(() => {
	const concepts = query.data.value?.results ?? [];

	const items = concepts.map((concept) => {
		return { key: String(concept.id), label: concept.pref_label };
	});

	return [{ key: all, label: "All text genres" }, ...items];
});

const { searchFilters, setSearchFilters } = useSearchFilters();
const selectedKey = computed(() => {
	if (searchFilters.value["text-genre"].length === 0) return all;

	return String(searchFilters.value["text-genre"][0]!);
});

function onChangeSelection(_selectedKey: string) {
	const genres = _selectedKey === all ? [] : [Number(_selectedKey)];
	setSearchFilters({ ...searchFilters.value, "text-genre": genres, offset: 0 });
}
</script>

<template>
	<SingleSelect
		:items="items"
		:label="label"
		name="query-mode"
		:selected-key="selectedKey"
		@change-selection="onChangeSelection"
	/>
</template>

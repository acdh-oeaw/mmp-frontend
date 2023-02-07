<script lang="ts" setup>
import { keyByToMap } from '@stefanprobst/key-by';
import { computed, ref, watch } from 'vue';

import { type GetAutoComplete, type ResourceKey, useAutoComplete } from '@/api';
import SearchAutocompleteSelectedItem from '@/components/search-autocomplete-selected-item.vue';
import { createSearchFilterKey } from '@/lib/search/create-case-studies-search-filter-key';
import { getResourceColor } from '@/lib/search/get-resource-color';
import { createResourceKey, splitResourceKey } from '@/lib/search/resource-key';
import { keywordTypeLabels, kindLabels } from '@/lib/search/search.config';
import type { Item } from '@/lib/search/search.types';
import type { SearchFilters } from '@/lib/search/use-case-studies-search-filters';
import { useCaseStudiesSearchFilters } from '@/lib/search/use-case-studies-search-filters';
import { useCaseStudiesSearchFormSelection } from '@/lib/search/use-case-studies-search-form-selection';
import { truncate } from '@/lib/truncate';
import { useVuetify } from '@/lib/use-vuetify';

const emit = defineEmits<{
	(event: 'submit', searchFilters: SearchFilters): void;
}>();

const { searchFilters, setSearchFilters } = useCaseStudiesSearchFilters();
const { selectedKeys, setSelectedKeys, removeSelectedKey, clearSelectedKeys } =
	useCaseStudiesSearchFormSelection();

function onUpdateSelectedKeys(keys: Array<ResourceKey>) {
	setSelectedKeys(keys);
}

function onRemoveSelectedKey(key: ResourceKey) {
	removeSelectedKey(key);
}

function onClearSelectedKeys() {
	clearSelectedKeys();
}

//

function onSubmit() {
	const nextSearchFilters: SearchFilters = {
		...searchFilters.value,
		author: [],
		keyword: [],
	};

	selectedKeys.value.forEach((key) => {
		const { kind, id } = splitResourceKey(key);
		const filter = createSearchFilterKey(kind);
		nextSearchFilters[filter].push(id);
	});

	setSearchFilters(nextSearchFilters);

	emit('submit', nextSearchFilters);
}

//

const searchTerm = ref('');

function onUpdateSearchTerm(value: string | null) {
	searchTerm.value = value ?? '';
}

//

const searchParams = computed<GetAutoComplete.SearchParams>(() => {
	return {
		kind: ['autor', 'keyword'],
		// return 10 results per `kind`. note that results will be sorted by `kind`.
		page_size: 10,
		q: searchTerm.value.trim(),
	};
});

const autoCompleteQuery = useAutoComplete(searchParams);

const isFetching = computed(() => {
	return autoCompleteQuery.isFetching.value;
});

const _isLoading = computed(() => {
	return autoCompleteQuery.isInitialLoading.value;
});

const itemsByKey = computed<Map<ResourceKey, Item>>(() => {
	return keyByToMap(autoCompleteQuery.data.value?.results ?? [], (item) => {
		return item.key;
	});
});

//

const cache = ref<Record<ResourceKey, Item>>({});

watch(itemsByKey, (itemsByKey) => {
	itemsByKey.forEach((item, key) => {
		cache.value[key] = item;
	});
});

const items = computed(() => {
	const items = [...itemsByKey.value.values()];

	selectedKeys.value.forEach((key) => {
		if (!itemsByKey.value.has(key)) {
			const item = cache.value[key];
			if (item != null) {
				items.push(item);
			}
		}
	});

	return items.sort((a, b) => {
		return a.label.localeCompare(b.label);
	});
});

//

watch(
	searchFilters,
	() => {
		selectedKeys.value = [
			...searchFilters.value['author'].map((id) => {
				return createResourceKey({ kind: 'autor', id });
			}),
			...searchFilters.value['keyword'].map((id) => {
				return createResourceKey({ kind: 'keyword', id });
			}),
		];
	},
	{ immediate: true }
);

function onLoadItem(item: Item) {
	cache.value[item.key] = item;
}

//

const nothingFoundText = computed(() => {
	return autoCompleteQuery.isFetching.value ? 'Loading...' : 'Nothing found';
});

const label = 'Search for case studies by authors or keywords';

//

function getKindLabel(value: Item) {
	const kindLabel = kindLabels[value.kind].one;
	if (value.kind === 'keyword') {
		return `${kindLabel} (${keywordTypeLabels[value.type].one})`;
	}
	return kindLabel;
}

//

const vuetify = useVuetify();
</script>

<template>
	<form class="case-studies-search-form" novalidate role="search" @submit.prevent="onSubmit">
		<VAutocomplete
			:aria-label="label"
			auto-select-first
			:cache-items="false"
			color="primary"
			hide-details
			item-text="label"
			item-value="key"
			:items="items"
			:loading="isFetching"
			multiple
			name="case-studies-search-filters"
			:no-data-text="nothingFoundText"
			no-filter
			:placeholder="label"
			:search-input="searchTerm"
			type="search"
			:value="selectedKeys"
			@change="searchTerm = ''"
			@input="onUpdateSelectedKeys"
			@update:search-input="onUpdateSearchTerm"
		>
			<!-- In Vuetify 3 we can use a single #chip slot, instead of #prepend-inner and #selection. -->
			<template #prepend-inner>
				<template v-for="key of selectedKeys">
					<SearchAutocompleteSelectedItem
						v-if="!(key in cache)"
						:key="key"
						v-bind="splitResourceKey(key)"
						@load-item="onLoadItem"
					>
						<VSkeletonLoader type="chip" />
					</SearchAutocompleteSelectedItem>
				</template>
			</template>
			<template #selection="{ item }">
				<VChip
					v-if="item.key in cache"
					close
					:close-label="`Remove ${item.label}`"
					:color="getResourceColor(item)"
					@click:close="onRemoveSelectedKey(item.key)"
				>
					{{ truncate(item.label, 30) }}
				</VChip>
			</template>

			<template #item="{ item }">
				<VListItemContent>
					<VListItemTitle>{{ item.label }}</VListItemTitle>
					<VListItemSubtitle>{{ getKindLabel(item) }}</VListItemSubtitle>
				</VListItemContent>
			</template>

			<template #append>
				<VIcon
					v-if="selectedKeys.length"
					aria-label="Clear search filters"
					color="primary"
					@click="onClearSelectedKeys"
				>
					mdi-close
				</VIcon>
			</template>
		</VAutocomplete>

		<VBtn
			block
			:class="{ square: !vuetify.breakpoint.mobile }"
			depressed
			height="100%"
			min-height="50px"
			type="submit"
			x-large
		>
			<VIcon :left="vuetify.breakpoint.mobile">mdi-magnify</VIcon>
			<span :class="{ 'd-sr-only': !vuetify.breakpoint.mobile }">Search</span>
		</VBtn>
	</form>
</template>

<style scoped>
.case-studies-search-form {
	display: grid;
	grid-template-columns: 1fr auto;
	gap: 16px;
	align-items: center;
}
</style>

<style>
/* An absolute value ensures the overlay is not wider than the input. */
.v-autocomplete__content {
	max-width: 768px;
}

.v-input__prepend-inner {
	margin-block: 4px;
	gap: 4px;
}
</style>

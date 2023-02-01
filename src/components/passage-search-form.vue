<script lang="ts" setup>
import { keyByToMap } from '@stefanprobst/key-by';
import { computed, ref, watch } from 'vue';

import { type GetAutoComplete, type ResourceKey, useAutoComplete } from '@/api';
import { createResourceKey, splitResourceKey } from '@/lib/resource-key';
import { createSearchFilterKey } from '@/lib/search/create-search-filter-key';
import { getResourceColor } from '@/lib/search/get-resource-color';
import { keywordTypeLabels, kindLabels } from '@/lib/search/search.config';
import type { Item } from '@/lib/search/search.types';
import type { SearchFilters } from '@/lib/search/use-search-filters';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { truncate } from '@/lib/truncate';

const { searchFilters, setSearchFilters, defaultSearchFilters } = useSearchFilters();

const selectedKeys = ref<Array<ResourceKey>>([]);

function onUpdateSelectedKeys(keys: Array<ResourceKey>) {
  selectedKeys.value = keys;
}

function onSubmit() {
  const searchFilters: SearchFilters = { ...defaultSearchFilters };

  selectedKeys.value.forEach((key) => {
    const { kind, id } = splitResourceKey(key);
    const filter = createSearchFilterKey(kind);
    searchFilters[filter].push(id);
  });

  setSearchFilters(searchFilters);
}

//

const searchTerm = ref('');

function onUpdateSearchTerm(value: string | null) {
  searchTerm.value = value ?? '';
}

//

const searchParams = computed<GetAutoComplete.SearchParams>(() => {
  return {
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

const cache = ref(new Map<ResourceKey, Item>());

watch(itemsByKey, (itemsByKey) => {
  itemsByKey.forEach((item, key) => {
    cache.value.set(key, item);
  });
});

const items = computed(() => {
  const items = [...itemsByKey.value.values()];

  selectedKeys.value.forEach((key) => {
    if (!itemsByKey.value.has(key)) {
      const item = cache.value.get(key);
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
      ...searchFilters.value['passage'].map((id) => {
        return createResourceKey({ kind: 'stelle', id });
      }),
      ...searchFilters.value['place'].map((id) => {
        return createResourceKey({ kind: 'ort', id });
      }),
      ...searchFilters.value['case-study'].map((id) => {
        return createResourceKey({ kind: 'usecase', id });
      }),
    ];
  },
  { immediate: true }
);

function onLoadItem(item: Item) {
  cache.value.set(item.key, item);
}

//

const nothingFoundText = computed(() => {
  return autoCompleteQuery.isFetching.value ? 'Loading...' : 'Nothing found';
});

const label = 'Search for passages';

//

function getKindLabel(value: Item) {
  const kindLabel = kindLabels[value.kind].one;
  if (value.kind === 'keyword') {
    return `${kindLabel} (${keywordTypeLabels[value.type].one})`;
  }
  return kindLabel;
}
</script>

<template>
  <form novalidate role="search" @submit.prevent="onSubmit">
    <VAutocomplete
      :aria-label="label"
      auto-select-first
      chips
      clearable
      closable-chips
      color="primary"
      hide-details
      item-text="label"
      item-value="key"
      :items="items"
      :loading="isFetching"
      multiple
      name="search-filters"
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
      <template #chip="{ item, props }">
        <VChip
          v-if="cache.has(item.value)"
          v-bind="props"
          :close-label="`Remove ${item.title}`"
          :color="getResourceColor(item.raw)"
        />
        <SearchAutoCompleteSelectedItem
          v-else
          v-bind="splitResourceKey(item.value)"
          @load-item="onLoadItem"
        >
          <!-- TODO: use skeleton loader -->
          <!-- <VChip :closable="false">Loading...</VChip> -->
          <VSkeletonLoader type="chip" />
        </SearchAutoCompleteSelectedItem>
      </template>

      <template #item="{ item }">
        <VListItemContent>
          <VListItemTitle>{{ item.label }}</VListItemTitle>
          <VListItemSubtitle>{{ getKindLabel(item) }}</VListItemSubtitle>
        </VListItemContent>
      </template>
    </VAutocomplete>

    <VBtn type="submit">
      <VIcon left>mdi-magnify</VIcon>
      <span class="d-sr-only">Search</span>
    </VBtn>
  </form>
</template>

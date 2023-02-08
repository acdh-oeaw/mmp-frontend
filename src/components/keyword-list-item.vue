<script lang="ts" setup>
import { computed } from 'vue';

import { type Keyword, usePassages } from '@/api';
import { getAuthorLabel } from '@/lib/get-label';
import { useSearchFilters } from '@/lib/search/use-search-filters';

const props = defineProps<{
  parentNodes: Array<Keyword['id']>;
  siblingNode: Keyword['id'];
}>();

const { createSearchFilterParams, searchFilters } = useSearchFilters();
const passagesQuery = usePassages(
  computed(() => ({
    [searchFilters.value['query-mode'] === 'intersection' ? 'key_word_and' : 'key_word']: [
      props.siblingNode,
      ...props.parentNodes,
    ],
    has_usecase: searchFilters.value['dataset'] === 'case-studies',
  }))
);

const isLoading = computed(() => {
  return passagesQuery.isInitialLoading.value;
});

const passages = computed(() => {
  return passagesQuery.data.value?.results ?? [];
});
</script>

<template>
  <VCard flat color="rgba(0, 0, 0, 0)">
    <VList two-line>
      <VSkeletonLoader
        v-if="isLoading"
        type="list-item-three-line@3"
        class="transparent-skeleton"
      />

      <template v-else-if="passages.length">
        <VListItem
          v-for="passage of passages"
          :key="passage.id"
          three-line
          :to="{
            query: createSearchFilterParams({ ...searchFilters, passage: [passage.id] }),
            params: { id: passage.id },
          }"
        >
          <VListItemContent>
            <VListItemTitle>
              {{ passage.display_label }}
            </VListItemTitle>
            <VListItemSubtitle v-if="passage.text?.autor?.length">
              {{ passage.text.title }},
              {{ passage.text.autor.map(getAuthorLabel).join(', ') }}
            </VListItemSubtitle>
            <VListItemSubtitle v-if="passage.text?.jahrhundert">
              {{ passage.text.jahrhundert }} century
            </VListItemSubtitle>
          </VListItemContent>
          <VListItemIcon>
            <VIcon>mdi-chevron-right</VIcon>
          </VListItemIcon>
        </VListItem>
      </template>

      <VListItem v-else>No passages found!</VListItem>
    </VList>
  </VCard>
</template>

<style>
div.transparent-skeleton > div {
  background-color: transparent !important;
}

.v-expansion-panel-content__wrap {
  padding-left: 0;
}

.list-item {
  margin-bottom: 10px;
}
</style>

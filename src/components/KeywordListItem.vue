<script lang="ts" setup>
import { computed } from 'vue';

import { usePassages } from '@/api';
import { getAuthorLabel } from '@/lib/get-label';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { useFullScreen } from '@/lib/use-full-screen';

const props = defineProps<{
  parentNodes: Array<any>;
  siblingNode: any;
}>();

const { searchFilters, createSearchFilterParams } = useSearchFilters();

const passagesQuery = usePassages(
  computed(() => ({
    [searchFilters.value['query-mode'] === 'intersection' ? 'key_word_and' : 'key_word']: [
      props.siblingNode,
      ...props.parentNodes,
    ],
    has_usecase: searchFilters.value['dataset'] === 'case-studies',
  }))
);

const isLoading = computed(() => passagesQuery.isInitialLoading.value);

const passages = computed(() => passagesQuery.data.value?.results ?? []);

const isFullScreen = useFullScreen();
</script>

<template>
  <v-card flat color="rgba(0, 0, 0, 0)">
    <v-list two-line>
      <v-skeleton-loader
        v-if="isLoading"
        type="list-item-three-line@3"
        class="transparent-skeleton"
      />
      <template v-else-if="passages.length">
        <v-list-item
          v-for="passage in passages"
          :key="passage.id"
          three-line
          :to="{
            name: isFullScreen ? 'Passage Detail Fullscreen' : 'Passage Detail',
            query: createSearchFilterParams({ ...searchFilters, passage: [passage.id] }),
            params: { id: passage.id },
          }"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ passage.display_label }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="passage.text?.autor?.length">
              {{ passage.text.title }},
              {{ passage.text.autor.map((x) => getAuthorLabel(x)).join(', ') }}
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="passage.text?.jahrhundert">
              {{ passage.text.jahrhundert }} century
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </template>

      <v-list-item v-else>No passages found!</v-list-item>
    </v-list>
  </v-card>
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

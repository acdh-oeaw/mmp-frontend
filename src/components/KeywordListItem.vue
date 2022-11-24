<template>
  <v-card flat color="rgba(0, 0, 0, 0)">
    <v-list two-line>
      <v-skeleton-loader
        v-if="isLoading"
        type="list-item-three-line@3"
        class="transparent-skeleton"
      />
      <v-list-item
        v-for="passage in data"
        v-else-if="data.length"
        :key="passage.id"
        three-line
        :to="{
          name: fullscreen ? 'Passage Detail Fullscreen' : 'Passage Detail',
          query: addParamsToQuery({ Passage: passage.id }),
          params: { id: passage.id },
        }"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ passage.display_label }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="passage.text?.autor?.length">
            {{ passage.text.title }},
            {{ passage.text.autor.map((x) => getOptimalName(x)).join(', ') }}
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="passage.text?.jahrhundert">
            {{ passage.text.jahrhundert }} century
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon>mdi-chevron-right</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item v-else>No passages found!</v-list-item>
    </v-list>
  </v-card>
</template>
<script>
import { computed } from 'vue';

import { usePassages } from '@/api';
import helpers from '@/helpers';
import { useStore } from '@/lib/use-store';

export default {
  mixins: [helpers],
  props: ['parentNodes', 'siblingNode'],
  setup(props) {
    const store = useStore();

    const passagesQuery = usePassages(
      computed(() => ({
        [store.state.apiParams.intersect ? 'key_word_and' : 'key_word']: [
          props.siblingNode,
          ...props.parentNodes,
        ],
        has_usecase: store.state.apiParams.hasUsecase,
      }))
    );

    const isLoading = computed(() => passagesQuery.isInitialLoading.value);

    const passages = computed(() => passagesQuery.data.value?.results ?? []);

    return {
      isLoading,
      data: passages,
    };
  },
};
</script>

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

<template>
  <v-container>
    <v-row>
      <v-col offset="0" offset-lg="4" cols="12" lg="6">
        <v-autocomplete
          v-model="selectedValues"
          auto-select-first
          chips
          color="primary"
          deletable-chips
          item-text="label"
          :items="items"
          :loading="isFetching"
          multiple
          no-data-text="Nothing found"
          no-filter
          placeholder="Search for case studies by authors or keywords"
          return-object
          :search-input="searchTerm"
          type="search"
          @update:search-input="onUpdateSearchTerm"
          @change="searchTerm = ''"
        >
          <template #item="{ item }">
            <v-list-item-content>
              <v-list-item-title>{{ item.label }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.kind }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
          <template #append>
            <v-icon v-if="selectedValues.length" color="primary" @click="selectedValues = []">
              mdi-close
            </v-icon>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" lg="8">
        <!-- TODO: loading indicator, nothing found message -->
        <v-card v-for="study in studies" :key="study.id" class="study-card">
          <v-card-title>{{ study.title }}</v-card-title>
          <v-card-subtitle v-if="study.principal_investigator">
            {{ study.principal_investigator }}
          </v-card-subtitle>
          <v-card-text v-if="study.description">{{ study.description }}</v-card-text>
          <v-card-actions>
            <v-btn
              text
              :to="{
                name: 'Case Study',
                params: { id: study.id, query: $route.query },
              }"
            >
              Read More
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { groupBy } from '@stefanprobst/group-by';
import { computed, ref } from 'vue';

import { useAutoComplete, useCaseStudies } from '@/api';
import helpers from '@/helpers';
import type { Item } from '@/lib/search/search.types';
import { uniqueItems } from '@/lib/search/unique-items';

export default {
  name: 'CaseStudies',
  mixins: [helpers],
  setup() {
    const searchTerm = ref('');
    const selectedValues = ref<Array<Item>>([]);

    function onUpdateSearchTerm(value: string | null) {
      searchTerm.value = value ?? '';
    }

    const autoCompleteQuery = useAutoComplete(
      computed(() => ({ q: searchTerm.value.trim(), kind: ['autor', 'keyword'] }))
    );
    const isFetching = computed(() => autoCompleteQuery.isFetching.value);
    const items = computed(() => {
      // selected values must always be included in items, otherwise the chips for selected values
      // will not be displayed when they are no longer in the items list matching the current search term.
      if (autoCompleteQuery.data.value == null) {
        return selectedValues.value;
      }

      return uniqueItems(autoCompleteQuery.data.value.results, selectedValues.value);
    });

    // TODO: debounce, or require explicit form submit
    const searchFilters = computed(() => groupBy(selectedValues.value, (value) => value.kind));

    const caseStudiesQuery = useCaseStudies(
      computed(() => ({
        has_stelle__text__autor: searchFilters.value['autor']?.map((value) => value.id),
        has_stelle__key_word: searchFilters.value['keyword']?.map((value) => value.id),
      }))
    );
    const isLoading = computed(() => caseStudiesQuery.isInitialLoading.value);
    const studies = computed(() => caseStudiesQuery.data.value?.results ?? []);

    return {
      searchTerm,
      onUpdateSearchTerm,
      selectedValues,
      isFetching,
      items,

      isLoading,
      studies,
    };
  },
};
</script>
<style scoped>
.study-card {
  margin-bottom: 20px;
}
</style>

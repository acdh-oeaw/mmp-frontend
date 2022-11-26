<script lang="ts" setup>
import { computed } from 'vue';

import type { ResourceKind } from '@/api';
import { colors, kindLabels } from '@/lib/search/search.config';
import {
  type DataSet,
  type QueryMode,
  type SearchFilters,
  useSearchFilters,
} from '@/lib/search/use-search-filters';
import { useStore } from '@/lib/use-store';

const store = useStore();
const { searchFilters, setSearchFilters } = useSearchFilters();

const resourceKinds: Array<ResourceKind> = ['autor', 'keyword', 'ort', 'stelle', 'usecase'];

const queryModes: Record<QueryMode, { label: string; description: string }> = {
  intersection: {
    label: 'Intersection',
    description: 'Show results that contain all inputs',
  },
  union: {
    label: 'Union',
    description: 'Show all results for all inputs',
  },
};

const datasets: Record<DataSet, { label: string }> = {
  'case-studies': { label: 'Related to Case Studies' },
  gens: { label: 'Related to GENS Database' },
  all: { label: 'Include everything' },
};

const kind = computed({
  get() {
    return store.state.search.kinds;
  },
  set(values: Array<ResourceKind>) {
    store.commit('setSearchKinds', values);
  },
});

const dataset = computed({
  get() {
    return searchFilters.value['dataset'];
  },
  set(value: SearchFilters['dataset']) {
    setSearchFilters({ ...searchFilters.value, dataset: value });
  },
});

const queryMode = computed({
  get() {
    return searchFilters.value['query-mode'];
  },
  set(value: SearchFilters['query-mode']) {
    setSearchFilters({ ...searchFilters.value, 'query-mode': value });
  },
});
</script>

<template>
  <v-card class="option-card">
    <v-card-title>Search Options</v-card-title>
    <v-card-subtitle>Change your preferred filters</v-card-subtitle>
    <v-card-text>
      <v-checkbox
        v-for="resourceKind of resourceKinds"
        :key="resourceKind"
        v-model="kind"
        :label="kindLabels[resourceKind].one"
        :value="resourceKind"
        :color="colors[resourceKind]"
      />
      <v-divider />
      <v-radio-group v-model="dataset" label="Include Data:">
        <v-radio
          v-for="(option, key) of datasets"
          :key="key"
          :label="option.label"
          color="teal lighten-2"
          :value="key"
        />
      </v-radio-group>
      <v-divider />
      <v-radio-group v-model="queryMode">
        <template #label>
          When using multiple entries, use:
          <v-tooltip right transition="scroll-x-transition">
            <template #activator="{ on, attrs }">
              <v-icon small v-bind="attrs" v-on="on">mdi-help-circle-outline</v-icon>
            </template>
            Note: this only works for certain entities
          </v-tooltip>
        </template>
        <v-radio v-for="(option, key) of queryModes" :key="key" color="teal lighten-2" :value="key">
          <template #label>
            <div>
              <div class="theme--light v-label">{{ option.label }}</div>
              <div class="font-weight-regular caption">{{ option.description }}</div>
            </div>
          </template>
        </v-radio>
      </v-radio-group>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.option-card {
  max-height: 50vh;
  overflow-y: scroll;
}
</style>

<script lang="ts" setup>
import { dataSets, queryModes, useSearchFilters } from '@/lib/search/use-search-filters';

const { searchFilters, setSearchFilters } = useSearchFilters();
</script>

<template>
  <v-card class="search-options-card">
    <v-card-title>Search Options</v-card-title>
    <v-card-subtitle>Change your preferred filters</v-card-subtitle>

    <v-card-text>
      <v-radio-group v-model="hasUsecase" label="Include Data:">
        <v-radio
          v-for="dataSet of dataSets"
          :key="dataSet"
          label="Related to Case Studies"
          color="teal lighten-2"
          :value="dataSet"
        />
      </v-radio-group>

      <v-divider />

      <v-radio-group v-model="intersection">
        <template #label>
          When using multiple entries, use:
          <v-tooltip right transition="scroll-x-transition">
            <template #activator="{ on, attrs }">
              <v-icon small v-bind="attrs" v-on="on">mdi-help-circle-outline</v-icon>
            </template>
            <!-- FIXME: which ones? -->
            Note: this only works for certain entities
          </v-tooltip>
        </template>
        <v-radio
          v-for="queryMode of queryModes"
          :key="queryMode"
          color="teal lighten-2"
          :value="queryMode"
        >
          <template #label>
            <div>
              <div class="theme--light v-label">Intersection</div>
              <div class="font-weight-regular caption">Show results that contain all inputs</div>
            </div>
          </template>
        </v-radio>
      </v-radio-group>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.search-options-card {
  max-height: 50vh;
  overflow-y: scroll;
}
</style>

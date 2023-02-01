<script lang="ts" setup>
import { computed } from 'vue';

import { useStore } from '@/lib/use-store';

const store = useStore();

const hasUsecase = computed({
  get() {
    return store.state.apiParams.hasUsecase;
  },
  set(val) {
    store.commit('setApiParam', { key: 'hasUsecase', val });
  },
});

const intersection = computed({
  get() {
    return store.state.apiParams.intersect;
  },
  set(val) {
    store.commit('setApiParam', { key: 'intersect', val });
  },
});
</script>

<template>
  <v-card class="option-card">
    <v-card-title>Search Options</v-card-title>
    <v-card-subtitle>Change your preferred filters</v-card-subtitle>
    <v-card-text>
      <v-radio-group v-model="hasUsecase" label="Include Data:">
        <v-radio label="Related to Case Studies" color="teal lighten-2" value="true" />
        <v-radio label="Related to GENS Database" color="teal lighten-2" value="false" />
        <v-radio label="Include everything" color="teal lighten-2" value="don" />
      </v-radio-group>
      <v-divider />
      <v-radio-group v-model="intersection">
        <template #label>
          When using multiple entries, use:
          <v-tooltip right transition="scroll-x-transition">
            <template #activator="{ on, attrs }">
              <v-icon small v-bind="attrs" v-on="on"> mdi-help-circle-outline</v-icon>
            </template>
            Note: this only works for certain entities
          </v-tooltip>
        </template>
        <v-radio color="teal lighten-2" :value="true">
          <template #label>
            <div>
              <div class="theme--light v-labek">Intersection</div>
              <div class="font-weight-regular caption">Show results that contain all inputs</div>
            </div>
          </template>
        </v-radio>
        <v-radio color="teal lighten-2" :value="false">
          <template #label>
            <div>
              <div class="theme--light v-labek">Union</div>
              <div class="font-weight-regular caption">Show all results for all inputs</div>
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

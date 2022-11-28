<script lang="ts" setup>
import type { GeojsonLayer } from '@/api';

const _props = defineProps<{
  layers: Array<GeojsonLayer>;
}>();
</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header>Layer sources</v-expansion-panel-header>
      <v-expansion-panel-content class="ma-2">
        <ul role="list">
          <li v-for="layer of layers" :key="layer.id">
            <div>{{ layer.title }}</div>
            <div>{{ layer.attribution }}</div>
            <div>{{ layer.description }}</div>
          </li>
        </ul>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { useSpatialCoverageGeojsonById } from '@/api';
import { getDateRangeLabel } from '@/lib/get-label';
import { useDrawerWidth } from '@/lib/use-drawer-width';
import { useFullScreen } from '@/lib/use-full-screen';

const route = useRoute();
// FIXME: currently the map view encodes multiple ids as path param when a point is clicked
// which has multiple overlapping spatial coverages, which is a really bad idea
const id = computed(() => {
  return String(route.params.id).startsWith('[')
    ? String(route.params.id).slice(1, -1).split(',').map(Number)[0]
    : Number(route.params.id);
});

const spatialCoverageQuery = useSpatialCoverageGeojsonById({ id });

const isLoading = computed(() => spatialCoverageQuery.isInitialLoading.value);

const spatialCoverage = computed(() => spatialCoverageQuery.data.value);

// FIXME: only temporary
const data = computed(() => {
  if (spatialCoverage.value == null) return [];
  return [spatialCoverage.value];
});

const isFullScreen = useFullScreen();
const drawerWidth = useDrawerWidth();
</script>

<template>
  <v-navigation-drawer permanent fixed right color="#F1F5FA" :width="drawerWidth">
    <v-list-item>
      <v-list-item-action>
        <router-link
          :to="{ name: isFullScreen ? 'Map Fullscreen' : 'Map', query: route.query }"
          class="text-decoration-none"
        >
          <v-icon>mdi-close</v-icon>
        </router-link>
      </v-list-item-action>
      <v-list-item-title> Keyword(s) found at point </v-list-item-title>
    </v-list-item>
    <v-divider />
    <v-list v-if="!isLoading" v-model="data">
      <v-list v-for="d in data" :key="d.id">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title v-if="d.properties.key_word?.stichwort" class="text-h5">
              Keyword: {{ d.properties.key_word.stichwort }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="d.properties.key_word?.art">
              {{ d.properties.key_word.art }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-subheader hide-details>Texts</v-subheader>
        <v-list-item v-for="text in d.properties.texts" :key="text.id">
          <v-list>
            <v-list-item-content>
              <v-list-item-title>
                {{ text.title }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="text.authors.length">
                {{ text.authors.map((author) => author.name).join(', ') }}
              </v-list-item-subtitle>
              <v-list-item-subtitle v-if="text.places.length"> </v-list-item-subtitle>
            </v-list-item-content>
          </v-list>
        </v-list-item>
        <v-subheader>Passages</v-subheader>
        <v-list-item
          v-for="passage in d.properties.stelle"
          :key="passage.id"
          :to="{
            name: isFullScreen ? 'Passage Detail Fullscreen' : 'Passage Detail',
            query: { ...route.query, Passage: passage.id },
            params: { id: passage.id },
          }"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ passage.display_label }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="passage.start_date || passage.end_date">
              {{ getDateRangeLabel(passage.start_date, passage.end_date) }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-divider />
      </v-list>
    </v-list>
    <v-list v-else>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <v-skeleton-loader type="sentences@7" />
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

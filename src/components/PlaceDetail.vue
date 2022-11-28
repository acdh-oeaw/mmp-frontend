<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { useAuthors, usePlaceById, useTexts } from '@/api';
import PlaceMap from '@/components/geo-map/place-map.vue';
import { getAuthorLabel, getPlaceLabel } from '@/lib/get-label';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { useDrawerWidth } from '@/lib/use-drawer-width';
import { useFullScreen } from '@/lib/use-full-screen';

const route = useRoute();
const id = computed(() => Number(route.params.id));
const { searchFilters, createSearchFilterParams } = useSearchFilters();

const placeQuery = usePlaceById({ id });
const textsQuery = useTexts(
  computed(() => ({
    ort: [id.value],
    has_usecase: searchFilters.value['dataset'] === 'case-studies',
  }))
);
const authorsQuery = useAuthors(
  computed(() => ({
    ort: [id.value],
    has_usecase: searchFilters.value['dataset'] === 'case-studies',
  }))
);

const isLoading = computed(() => {
  return [placeQuery, textsQuery, authorsQuery].some((query) => query.isInitialLoading.value);
});

const place = computed(() => placeQuery.data.value);
const texts = computed(() => textsQuery.data.value?.results ?? []);
const authors = computed(() => authorsQuery.data.value?.results ?? []);

const textCount = computed(() => textsQuery.data.value?.count);
const authorCount = computed(() => authorsQuery.data.value?.count);

const drawerWidth = useDrawerWidth();
const isFullScreen = useFullScreen();
</script>

<template>
  <v-navigation-drawer permanent fixed right color="#F1F5FA" :width="drawerWidth">
    <v-list-item>
      <v-list-item-action>
        <router-link
          :to="{ name: isFullScreen ? 'Map Fullscreen' : 'Map', query: $route.query }"
          class="text-decoration-none"
        >
          <v-icon>mdi-close</v-icon>
        </router-link>
      </v-list-item-action>
      <v-list-item-content>
        <template v-if="!isLoading">
          <v-list-item-title class="text-h5">
            {{ getPlaceLabel(place) }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="place?.name_antik">
            {{ place.name_antik }}
          </v-list-item-subtitle>
          <v-list-item-subtitle> {{ place?.lat }}, {{ place?.long }} </v-list-item-subtitle>
        </template>
        <v-skeleton-loader v-else type="heading, text@2" />
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-container>
      <div v-if="place?.lat != null && place?.long != null" :style="{ height: '400px' }">
        <place-map :point="{ lat: place.lat, lng: place.long }" />
      </div>
    </v-container>
    <v-container>
      <v-expansion-panels v-if="!isLoading" flat accordion multiple :value="[0, 1]">
        <v-expansion-panel :disabled="!authorCount">
          <v-expansion-panel-header>
            <template #actions>
              <v-chip small color="red lighten-3" :disabled="!authorCount">
                {{ authorCount }}
              </v-chip>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
            Authors
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list-item
              v-for="author in authors"
              :key="author.id"
              :to="{
                name: isFullScreen ? 'Author Detail Fullscreen' : 'Author Detail',
                query: createSearchFilterParams({ ...searchFilters, author: [author.id] }),
                params: { id: author.id },
              }"
            >
              <v-list-item-content>
                <v-list-item-title>{{ getAuthorLabel(author) }}</v-list-item-title>
                <v-list-item-subtitle v-if="author.kommentar">
                  {{ author.kommentar }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>{{ author.jahrhundert }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon>mdi-chevron-right</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel :disabled="!textCount">
          <v-expansion-panel-header>
            <template #actions>
              <v-chip small color="red darken-3" dark :disabled="!textCount">
                {{ textCount }}
              </v-chip>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
            Texts
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list-item v-for="text in texts" :key="text.id" two-line>
              <v-list-item-content>
                <v-list-item-title>{{ text.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ text.autor.map((x) => getAuthorLabel(x)).join(', ') }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>{{ text.jahrhundert }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-skeleton-loader v-else type="paragraph@2" />
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { useAuthors, usePlaceById, useTexts } from '@/api';
import PlaceMap from '@/components/place-map.vue';
import { getAuthorLabel, getPlaceLabel } from '@/lib/get-label';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { useDrawerWidth } from '@/lib/use-drawer-width';
import { useFullScreen } from '@/lib/use-full-screen';

const route = useRoute();
const id = computed(() => Number(route.params.id));

const { createSearchFilterParams, searchFilters } = useSearchFilters();
const placeQuery = usePlaceById({ id });
const textsQuery = useTexts(
  computed(() => {
    return {
      ort: [id.value],
      has_usecase: searchFilters.value['query-mode'] === 'intersection',
    };
  })
);
const authorsQuery = useAuthors(
  computed(() => {
    return {
      ort: [id.value],
      has_usecase: searchFilters.value['query-mode'] === 'intersection',
    };
  })
);

const isLoading = computed(() => {
  return [placeQuery, textsQuery, authorsQuery].some((query) => query.isInitialLoading.value);
});

const place = computed(() => placeQuery.data.value);
const texts = computed(() => textsQuery.data.value?.results ?? []);
const authors = computed(() => authorsQuery.data.value?.results ?? []);

const textCount = computed(() => textsQuery.data.value?.count);
const authorCount = computed(() => authorsQuery.data.value?.count);

const isFullScreen = useFullScreen();
const drawerWidth = useDrawerWidth();
</script>

<template>
  <VNavigationDrawer color="background" fixed permanent right :width="drawerWidth">
    <VListItem>
      <VListItemAction>
        <RouterLink
          :to="{ name: isFullScreen ? 'Map Fullscreen' : 'Map', query: $route.query }"
          class="text-decoration-none"
        >
          <VIcon>mdi-close</VIcon>
        </RouterLink>
      </VListItemAction>
      <VListItemContent>
        <template v-if="!isLoading && place">
          <VListItemTitle class="text-h5">
            {{ getPlaceLabel(place) }}
          </VListItemTitle>
          <VListItemSubtitle v-if="place.name_antik">
            {{ place.name_antik }}
          </VListItemSubtitle>
          <VListItemSubtitle>{{ place.lat }}, {{ place.long }}</VListItemSubtitle>
        </template>

        <VSkeletonLoader v-else type="heading, text@2" />
      </VListItemContent>
    </VListItem>

    <VDivider />

    <VContainer>
      <div :style="{ height: '400px' }">
        <PlaceMap
          v-if="place?.lat != null && place?.long != null"
          :point="{ lat: place.lat, lng: place.long }"
        />
      </div>
    </VContainer>

    <VContainer>
      <VExpansionPanels v-if="!isLoading" flat accordion multiple :value="[0, 1]">
        <VExpansionPanel :disabled="!authorCount">
          <VExpansionPanelHeader>
            <template #actions>
              <VChip small color="red lighten-3" :disabled="!authorCount">
                {{ authorCount }}
              </VChip>
              <VIcon>mdi-chevron-down</VIcon>
            </template>
            Authors
          </VExpansionPanelHeader>
          <VExpansionPanelContent>
            <VListItem
              v-for="author in authors"
              :key="author.id"
              :to="{
                name: isFullScreen ? 'Author Detail Fullscreen' : 'Author Detail',
                query: createSearchFilterParams({ ...searchFilters, author: [author.id] }),
                params: { id: author.id },
              }"
            >
              <VLstItemContent>
                <VListItemTitle>{{ getAuthorLabel(author) }}</VListItemTitle>
                <VListItemSubtitle v-if="author.kommentar">
                  {{ author.kommentar }}
                </VListItemSubtitle>
                <VListItemSubtitle>{{ author.jahrhundert }}</VListItemSubtitle>
              </VLstItemContent>
              <VListItemIcon>
                <VIcon>mdi-chevron-right</VIcon>
              </VListItemIcon>
            </VListItem>
          </VExpansionPanelContent>
        </VExpansionPanel>
        <VExpansionPanel :disabled="!textCount">
          <VExpansionPanelHeader>
            <template #actions>
              <VChip small color="red darken-3" dark :disabled="!textCount">
                {{ textCount }}
              </VChip>
              <VIcon>mdi-chevron-down</VIcon>
            </template>
            Texts
          </VExpansionPanelHeader>
          <VExpansionPanelContent>
            <VListItem v-for="text in texts" :key="text.id" two-line>
              <VListItemContent>
                <VListItemTitle>{{ text.title }}</VListItemTitle>
                <VListItemSubtitle>
                  {{ text.autor.map(getAuthorLabel).join(', ') }}
                </VListItemSubtitle>
                <VListItemSubtitle>{{ text.jahrhundert }}</VListItemSubtitle>
              </VListItemContent>
            </VListItem>
          </VExpansionPanelContent>
        </VExpansionPanel>
      </VExpansionPanels>

      <VSkeletonLoader v-else type="paragraph@2" />
    </VContainer>
  </VNavigationDrawer>
</template>

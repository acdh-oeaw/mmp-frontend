<template>
  <v-navigation-drawer permanent fixed right color="#F1F5FA" :width="drawerWidth">
    <v-list-item>
      <v-list-item-action>
        <router-link
          :to="{ name: fullscreen ? 'Map Fullscreen' : 'Map', query: $route.query }"
          class="text-decoration-none"
        >
          <v-icon>mdi-close</v-icon>
        </router-link>
      </v-list-item-action>
      <v-list-item-content>
        <template v-if="!isLoading">
          <v-list-item-title class="text-h5">
            {{ getOptimalName(place) }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="place.name_antik">
            {{ place.name_antik }}
          </v-list-item-subtitle>
          <v-list-item-subtitle> {{ place.lat }}, {{ place.long }} </v-list-item-subtitle>
        </template>
        <v-skeleton-loader v-else type="heading, text@2" />
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-container>
      <div :style="{ height: '400px' }">
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
                name: fullscreen ? 'Author Detail Fullscreen' : 'Author Detail',
                query: addParamsToQuery({ Author: author.id }),
                params: { id: author.id },
              }"
            >
              <v-list-item-content>
                <v-list-item-title>{{ getOptimalName(author) }}</v-list-item-title>
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
                  {{ text.autor.map((x) => getOptimalName(x)).join(', ') }}
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

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { useAuthors, usePlaceById, useTexts } from '@/api';
import PlaceMap from '@/components/PlaceMap.vue';
import helpers from '@/helpers';
import { useStore } from '@/lib/use-store';

export default {
  name: 'PlaceDetail',
  components: { PlaceMap },
  mixins: [helpers],
  setup() {
    const route = useRoute();
    const store = useStore();
    const id = computed(() => Number(route.params.id));

    const placeQuery = usePlaceById({ id });
    const textsQuery = useTexts(
      computed(() => ({
        ort: id.value,
        has_usecase: store.state.apiParams.hasUsecase,
      }))
    );
    const authorsQuery = useAuthors(
      computed(() => ({
        ort: id.value,
        has_usecase: store.state.apiParams.hasUsecase,
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

    return {
      isLoading,
      place,
      texts,
      authors,
      textCount,
      authorCount,
    };
  },
};
</script>

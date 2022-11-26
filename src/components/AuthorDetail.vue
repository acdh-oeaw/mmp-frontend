<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { useAuthorById, useCaseStudies, useKeywords, usePassages } from '@/api';
import { getAuthorLabel, getPlaceLabel } from '@/lib/get-label';
import { keywordColors } from '@/lib/search/search.config';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { useDrawerWidth } from '@/lib/use-drawer-width';
import { useFullScreen } from '@/lib/use-full-screen';
import { useParentRoute } from '@/lib/use-parent-route';

const route = useRoute();
const { searchFilters, createSearchFilterParams } = useSearchFilters();
const id = computed(() => Number(route.params.id));

const authorByIdQuery = useAuthorById({ id });
const caseStudiesQuery = useCaseStudies(
  computed(() => ({
    has_stelle__text__autor: [id.value],
  }))
);
const passagesQuery = usePassages(
  computed(() => ({
    text__autor: [id.value],
    has_usecase: searchFilters.value['dataset'] === 'case-studies',
  }))
);
const keywordsQuery = useKeywords(
  computed(() => ({
    rvn_stelle_key_word_keyword__text__autor: [id.value],
    has_usecase: searchFilters.value['dataset'] === 'case-studies',
  }))
);

const isLoading = computed(() => {
  return [authorByIdQuery, caseStudiesQuery, passagesQuery, keywordsQuery].some((query) => {
    return query.isInitialLoading.value;
  });
});

const author = computed(() => authorByIdQuery.data.value);
const caseStudies = computed(() => caseStudiesQuery.data.value?.results ?? []);
const passages = computed(() => passagesQuery.data.value?.results ?? []);
const keywords = computed(() => keywordsQuery.data.value?.results ?? []);

const drawerWidth = useDrawerWidth();
const isFullScreen = useFullScreen();
const parentRoute = useParentRoute();
</script>

<template>
  <v-navigation-drawer permanent fixed right color="#f1f5fA" :width="drawerWidth">
    <v-list-item>
      <v-list-item-action>
        <router-link
          :to="{
            name: parentRoute?.name,
            query: $route.query,
          }"
          class="text-decoration-none"
        >
          <v-icon>mdi-close</v-icon>
        </router-link>
      </v-list-item-action>
      <v-list-item-content>
        <div v-if="!isLoading">
          <v-list-item-title class="text-h5">
            {{ getAuthorLabel(author) }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ author?.jahrhundert || 'Unknown century' }},
            {{ getPlaceLabel(author?.ort) }}
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="author?.gnd_id">
            GND-ID:
            <a :href="'https://d-nb.info/gnd/' + author.gnd_id" target="_blank"
              >{{ author.gnd_id }} <v-icon small>mdi-open-in-new</v-icon></a
            >
          </v-list-item-subtitle>
        </div>
        <v-skeleton-loader v-else type="heading, text@2" />
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-container>
      <div v-for="keyword in keywords" :key="keyword.id" class="keyword-chip">
        <v-chip
          :color="keywordColors[keyword.art]"
          small
          @click="
            $store.commit('addAutoCompleteSelectedValues', {
              id: keyword.id,
              label: keyword.stichwort,
              kind: 'keyword',
            })
          "
        >
          {{ keyword.stichwort }}
        </v-chip>
      </div>
      <v-expansion-panels :value="[0, 1]" flat accordion multiple>
        <v-expansion-panel :disabled="!isLoading && !caseStudies.length">
          <v-expansion-panel-header>
            Use Cases
            <template #actions>
              <v-chip small :disabled="!caseStudies.length" color="amber lighten-3">{{
                caseStudies.length
              }}</v-chip>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list v-if="!isLoading">
              <v-list-item
                v-for="caseStudy in caseStudies"
                :key="caseStudy.id"
                three-line
                :to="{
                  name: 'Case Study',
                  params: { id: caseStudy.id },
                  query: $route.query,
                }"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ caseStudy.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="caseStudy.principal_investigator">
                    {{ caseStudy.principal_investigator }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="caseStudy.description">
                    {{ caseStudy.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-icon>
              </v-list-item>
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
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel :disabled="!isLoading && !passages.length">
          <v-expansion-panel-header>
            Passages
            <template #actions>
              <v-chip small :disabled="!passages.length" color="teal lighten-4">{{
                passages.length
              }}</v-chip>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list v-if="!isLoading">
              <v-list-item
                v-for="passage in passages"
                :key="passage.id"
                three-line
                :to="{
                  name: isFullScreen ? 'Passage Detail Fullscreen' : 'Passage Detail',
                  query: createSearchFilterParams({ ...searchFilters, passage: [passage.id] }),
                  params: { id: passage.id },
                }"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ passage.display_label }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="passage.text?.autor.length">
                    {{ passage.text.title }},
                    {{ passage.text.autor.map((x) => getAuthorLabel(x)).join(', ') }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="passage.text?.jahrhundert">
                    {{ passage.text.jahrhundert }} century
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-icon>
              </v-list-item>
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
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </v-navigation-drawer>
</template>

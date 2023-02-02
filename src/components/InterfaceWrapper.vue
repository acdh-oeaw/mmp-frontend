<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

import DateRangeForm from '@/components/date-range-form.vue';
import PassageSearchForm from '@/components/passage-search-form.vue';
import SearchOptions from '@/components/search-options.vue';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { useDetailsPage } from '@/lib/use-details-page';
// TODO:
// import { recommendedSearchFilters } from '~/config/search.config';

const { createSearchFilterParams, searchFilters } = useSearchFilters();

const route = useRoute();
const router = useRouter();

const isDetailsPage = useDetailsPage();
const isSliderVisible = computed(() => route.name !== 'Word Cloud');
/**
 * When no search filters have been set, display an initial welcome screen.
 */
const isWelcomeScreenVisible = ref(
  Object.keys(route.query).length === 0 && Object.keys(route.params).length === 0
);

const currentView = computed({
  get() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return route.name!;
  },
  set(name: string) {
    router.push({ name, query: route.query });
  },
});
</script>

<template>
  <div>
    <v-container>
      <v-row :justify="isDetailsPage ? 'start' : 'center'">
        <v-col cols="12" :lg="isDetailsPage ? 8 : 12" xl="8">
          <v-row class="grey-bg">
            <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 1">
              <v-menu :close-on-content-click="false">
                <template #activator="{ on, attrs }">
                  <v-btn min-height="50px" height="100%" block depressed v-bind="attrs" v-on="on">
                    <v-icon>mdi-cog</v-icon>
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <SearchOptions />
              </v-menu>
            </v-col>

            <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 11">
              <PassageSearchForm @submit="isWelcomeScreenVisible = false" />
            </v-col>
          </v-row>
          <v-row class="grey-bg">
            <template v-if="!$vuetify.breakpoint.mobile">
              <v-col>
                <v-btn text small class="disable-events">View as</v-btn>
              </v-col>
              <v-col>
                <v-btn
                  text
                  block
                  small
                  class="view-picker"
                  :disabled="currentView === 'List'"
                  :class="{ active: currentView === 'List' }"
                  :to="{ name: 'List', query: route.query }"
                >
                  List
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  text
                  block
                  small
                  class="view-picker"
                  :disabled="currentView === 'Network Graph'"
                  :class="{ active: currentView === 'Network Graph' }"
                  :to="{ name: 'Network Graph', query: route.query }"
                >
                  Network Graph
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  text
                  block
                  small
                  class="view-picker"
                  :disabled="currentView === 'Map'"
                  :class="{ active: currentView === 'Map' }"
                  :to="{ name: 'Map', query: route.query }"
                >
                  Map
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  text
                  block
                  small
                  class="view-picker"
                  :disabled="currentView === 'Word Cloud'"
                  :class="{ active: currentView === 'Word Cloud' }"
                  :to="{ name: 'Word Cloud', query: route.query }"
                >
                  Word Cloud
                </v-btn>
              </v-col>
            </template>
            <template v-else>
              <v-col cols="12">
                <v-select
                  v-model="currentView"
                  :items="['List', 'Network Graph', 'Map', 'Word Cloud']"
                  label="View as"
                />
              </v-col>
            </template>
            <v-col
              :class="{
                'text-right': !$vuetify.breakpoint.mobile,
                'text-center': $vuetify.breakpoint.mobile,
              }"
            >
              <v-btn
                text
                block
                small
                class="justify-end"
                :to="{ name: 'List All', query: route.query }"
              >
                &nbsp;
                <v-icon>mdi-format-list-bulleted</v-icon>
                List All Entities
              </v-btn>
            </v-col>
          </v-row>

          <v-row v-if="isWelcomeScreenVisible" align="center" justify="center">
            <v-col cols="12" md="8">
              <div class="text-center no-query">
                <p>
                  Search our database for medieval <b>authors</b>, <b>passages</b>,
                  <b>keywords</b> (such as names of peoples) or <b>case studies</b>.
                </p>
                <p>
                  For instance, try
                  <v-chip
                    color="red lighten-3"
                    :href="{ query: createSearchFilterParams({ ...searchFilters, author: [8] }) }"
                  >
                    Baudonivia von Poitiers</v-chip
                  >
                  &#32;
                  <v-chip
                    color="blue lighten-4"
                    :href="{ query: createSearchFilterParams({ ...searchFilters, keyword: [33] }) }"
                  >
                    barbari</v-chip
                  >
                  or
                  <v-chip
                    color="amber lighten-3"
                    :href="{
                      query: createSearchFilterParams({ ...searchFilters, 'case-study': [3] }),
                    }"
                  >
                    Steppe Peoples 1: "Schwarzes Meer"</v-chip
                  >
                </p>
                <p>
                  Use the <b>slider</b> below to adjust and narrow down the <b>historical</b> scope
                  of your query.
                </p>
              </div>
            </v-col>
          </v-row>
          <v-row v-else>
            <router-view />
          </v-row>

          <v-row v-show="isSliderVisible">
            <v-col>
              <DateRangeForm />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style>
div.row a.view-picker.theme--light.v-btn.v-btn--disabled {
  color: rgb(0 0 0 / 87%) !important;
}

img.icon {
  height: 100%;
  width: 100%;
}

.disable-events {
  pointer-events: none;
}

.active {
  background-color: #e5e7eb !important;
}

.grey-bg {
  background-color: #e8ebf0;
  border-radius: 5px;
  margin-bottom: 22px;
}

.justify-end {
  justify-content: flex-end;
}

.no-query {
  height: 500px;
  font-size: 1.4em;
  color: #666 !important;
}

.slider {
  margin-top: 30px;
}

.v-slider {
  height: 44px;
}

div.v-slider__thumb-label.primary {
  background-color: transparent !important;
  height: 1.2rem !important;
  color: rgb(0 0 0 / 87%) !important;
}
</style>

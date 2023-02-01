<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';
import { VRangeSlider, VSlider } from 'vuetify/lib';

import { useAutoComplete } from '@/api';
import rangeSliderIcon from '@/assets/custom_range_icon.svg';
import sliderIcon from '@/assets/custom_slider_icon.svg';
import SearchOptions from '@/components/SearchOptions.vue';
import {
  colors,
  keywordTypeLabels,
  kindLabels,
  maxYear,
  minYear,
} from '@/lib/search/search.config';
import type { Item } from '@/lib/search/search.types';
import { uniqueItems } from '@/lib/search/unique-items';
import { truncate } from '@/lib/truncate';
import { useStore } from '@/lib/use-store';
import { recommendedSearchFilters } from '~/config/search.config';

const defaultChips = recommendedSearchFilters;

//

const route = useRoute();
const router = useRouter();
const store = useStore();

//

const sliderComponents = { 'v-range-slider': VRangeSlider, 'v-slider': VSlider };

type SliderComponent = keyof typeof sliderComponents;

const range = ref<number | [number, number]>([minYear, maxYear]);
const sliderComponent = ref<SliderComponent>('v-range-slider');

const isSliderVisible = computed(() => {
  return route.name !== 'Word Cloud';
});

function toggleSliderComponent(mode: SliderComponent) {
  if (mode !== sliderComponent.value) {
    if (Array.isArray(range.value)) {
      range.value = Math.round((range.value[0]! + range.value[1]!) / 2);
    } else {
      range.value = [range.value - 100, range.value + 100];
    }

    sliderComponent.value = mode;
  }
}

const slideOption = computed({
  get() {
    return store.state.apiParams.slider;
  },
  set(val) {
    store.commit('setApiParam', { key: 'slider', val });
  },
});

//

const currentView = computed({
  get() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return route.name!;
  },
  set(name: string) {
    router.push({ name, query: route.query });
  },
});

//

const searchTerm = ref('');
// TODO: selected values currently still live in global store because it is possible to change them from anywhere in the app
const selectedValues = computed(() => store.state.autocomplete.input);

function onUpdateSearchTerm(value: string | null) {
  searchTerm.value = value ?? '';
}

function onUpdateSelectedValues(values: Array<Item>) {
  store.commit('addAutoCompleteSelectedValues', values);
}

function onRemoveValue(value: Item) {
  store.commit('removeAutoCompleteSelectedValue', value);
}

function onClearSelectedValues() {
  searchTerm.value = '';
  store.commit('clearAutoCompleteSelectedValues');
}

const autoCompleteQuery = useAutoComplete(
  computed(() => ({
    // return 10 results per `kind`. note that results will be sorted by `kind`.
    page_size: 10,
    q: searchTerm.value.trim(),
  }))
);
const isFetching = computed(() => autoCompleteQuery.isFetching.value);
const items = computed(() => {
  // selected values must always be included in items, otherwise the chips for selected values
  // will not be displayed when they are no longer in the items list matching the current search term.
  if (autoCompleteQuery.data.value == null) {
    return selectedValues.value;
  }

  return uniqueItems(autoCompleteQuery.data.value.results, selectedValues.value);
});

const nothingFoundText = computed(() => {
  return autoCompleteQuery.isFetching.value ? 'Loading...' : 'Nothing found';
});

const label = 'Search for passages';

//

function pushQuery() {
  router.push({
    name: currentView.value,
    query: getQueryFromInput(selectedValues.value),
  });
}

function getQueryFromInput(input: Item[]) {
  function getIds(kind: Item['kind']) {
    return (
      input
        .filter((i) => i.kind === kind)
        .map((i) => i.id)
        .join('+') || undefined
    );
  }

  const query = {
    Author: getIds('autor'),
    Passage: getIds('stelle'),
    Keyword: getIds('keyword'),
    'Use Case': getIds('usecase'),
    Place: getIds('ort'),
  };

  // @ts-expect-error Will be fixed in useSearchFilters
  query.time = Array.isArray(range.value) ? range.value.join('+') : range.value;

  // @ts-expect-error Will be fixed in useSearchFilters
  if (query.time === '400+1200') query.time = undefined;

  return query;
}

function getKindLabel(value: Item) {
  const kindLabel = kindLabels[value.kind].one;
  if (value.kind === 'keyword') {
    return `${kindLabel} (${keywordTypeLabels[value.type].one})`;
  }
  return kindLabel;
}

function getColor(value: Item) {
  return colors[value.kind];
}
</script>

<template>
  <div>
    <v-container>
      <v-row :justify="currentView.includes('Detail') ? 'start' : 'center'">
        <v-col cols="12" :lg="currentView.includes('Detail') ? 8 : 12" xl="8">
          <v-row class="grey-bg">
            <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 1">
              <v-menu :close-on-content-click="false">
                <template #activator="{ on, attrs }">
                  <v-btn min-height="50px" height="100%" block depressed v-bind="attrs" v-on="on">
                    <v-icon>mdi-cog</v-icon>
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <search-options />
              </v-menu>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 10">
              <v-autocomplete
                :aria-label="label"
                auto-select-first
                color="primary"
                item-text="label"
                :items="items"
                :loading="isFetching"
                multiple
                :no-data-text="nothingFoundText"
                no-filter
                :placeholder="label"
                return-object
                :search-input="searchTerm"
                type="search"
                :value="selectedValues"
                @change="searchTerm = ''"
                @input="onUpdateSelectedValues"
                @update:search-input="onUpdateSearchTerm"
              >
                <template #item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.label }}</v-list-item-title>
                    <v-list-item-subtitle>{{ getKindLabel(item) }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template #selection="{ attrs, selected, select, item }">
                  <v-chip
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    :color="getColor(item)"
                    @click="select"
                    @click:close="onRemoveValue(item)"
                  >
                    {{ truncate(item.label, 30) }}
                  </v-chip>
                </template>
                <template #append>
                  <v-icon
                    v-if="selectedValues.length"
                    aria-label="Clear search filters"
                    color="primary"
                    @click="onClearSelectedValues"
                  >
                    mdi-close
                  </v-icon>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 1">
              <v-btn min-height="50px" height="100%" x-large block depressed @click="pushQuery">
                <v-icon>mdi-magnify</v-icon>{{ !$vuetify.breakpoint.mobile ? '' : 'Search' }}
              </v-btn>
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
                  :to="{
                    name: 'List',
                    query: {
                      ...route.query,
                      ...getQueryFromInput(store.state.autocomplete.input),
                    },
                  }"
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
          <v-row
            v-if="!Object.keys(route.query).length && !Object.keys(route.params).length"
            align="center"
            justify="center"
          >
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
                    @click="store.commit('addAutoCompleteSelectedValues', [defaultChips[0]])"
                  >
                    Baudonivia von Poitiers</v-chip
                  >
                  &#32;
                  <v-chip
                    color="blue lighten-4"
                    @click="store.commit('addAutoCompleteSelectedValues', [defaultChips[1]])"
                  >
                    barbari</v-chip
                  >
                  or
                  <v-chip
                    color="amber lighten-3"
                    @click="store.commit('addAutoCompleteSelectedValues', [defaultChips[2]])"
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
              <component
                :is="sliderComponents[sliderComponent]"
                v-model="range"
                class="slider"
                :max="maxYear"
                :min="minYear"
                thumb-label="always"
                light
                thumb-size="50"
                track-color="#d5d5d5"
                :track-fill-color="Array.isArray(range) ? '#0f1226' : '#d5d5d5'"
              >
                <template #thumb-label="{ value }"> {{ value }} AD </template>
                <template #append>
                  <v-menu :close-on-content-click="false">
                    <template #activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-cog</v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-text class="text-center">
                        <v-btn icon>
                          <img
                            class="icon"
                            :src="rangeSliderIcon"
                            alt="Range Icon"
                            @click="toggleSliderComponent('v-range-slider')"
                          />
                        </v-btn>
                        <v-btn icon>
                          <img
                            class="icon"
                            :src="sliderIcon"
                            alt="Slider Icon"
                            @click="toggleSliderComponent('v-slider')"
                          />
                        </v-btn>
                        <v-divider />
                        <v-radio-group v-model="slideOption" label="Timeslider should filter for:">
                          <v-radio
                            label="Temporal Coverage"
                            color="teal lighten-2"
                            value="passage"
                          />
                          <v-radio label="Time of composition" color="red darken-4" value="text" />
                        </v-radio-group>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </template>
              </component>
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

/* makes elements read-only */
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

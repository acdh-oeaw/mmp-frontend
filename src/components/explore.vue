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

const tabs = {
  'search-results': { name: 'List', label: 'List' },
  'network-graph': { name: 'Network Graph', label: 'Network Graph' },
  'geo-map': { name: 'Map', label: 'Map' },
  'word-cloud': { name: 'Word Cloud', label: 'Word Cloud' },
};
</script>

<template>
  <div>
    <VContainer>
      <VRow :justify="isDetailsPage ? 'start' : 'center'">
        <VCol cols="12" :lg="isDetailsPage ? 8 : 12" xl="8">
          <VRow class="grey-bg">
            <VCol :cols="$vuetify.breakpoint.mobile ? 12 : 1">
              <VMenu :close-on-content-click="false">
                <template #activator="{ on, attrs }">
                  <VBtn min-height="50px" height="100%" block depressed v-bind="attrs" v-on="on">
                    <VIcon>mdi-cog</VIcon>
                    <VIcon>mdi-chevron-down</VIcon>
                  </VBtn>
                </template>
                <SearchOptions />
              </VMenu>
            </VCol>

            <VCol :cols="$vuetify.breakpoint.mobile ? 12 : 11">
              <PassageSearchForm @submit="isWelcomeScreenVisible = false" />
            </VCol>
          </VRow>

          <VRow class="grey-bg">
            <template v-if="!$vuetify.breakpoint.mobile">
              <VCol>
                <!-- FIXME: this should not be a button -->
                <v-btn text small class="disable-events">View as</v-btn>
              </VCol>
              <VCol v-for="(tab, key) of tabs" :key="key">
                <VBtn
                  text
                  block
                  small
                  class="view-picker"
                  :disabled="currentView === tab.name"
                  :class="{ active: currentView === tab.name }"
                  :to="{ name: tab.name, query: route.query }"
                >
                  {{ tab.label }}
                </VBtn>
              </VCol>
            </template>

            <template v-else>
              <VCol cols="12">
                <VSelect
                  v-model="currentView"
                  :items="Object.values(tabs).map((tab) => tab.name)"
                  label="View as"
                />
              </VCol>
            </template>

            <VCol
              :class="{
                'text-right': !$vuetify.breakpoint.mobile,
                'text-center': $vuetify.breakpoint.mobile,
              }"
            >
              <VBtn
                text
                block
                small
                class="justify-end"
                :to="{ name: 'List All', query: route.query }"
              >
                &nbsp;
                <VIcon>mdi-format-list-bulleted</VIcon>
                List All Entities
              </VBtn>
            </VCol>
          </VRow>

          <VRow v-if="isWelcomeScreenVisible" align="center" justify="center">
            <VCol cols="12" md="8">
              <div class="text-center no-query">
                <p>
                  Search our database for medieval <b>authors</b>, <b>passages</b>,
                  <b>keywords</b> (such as names of peoples) or <b>case studies</b>.
                </p>
                <p>
                  For instance, try
                  <VChip
                    color="red lighten-3"
                    :to="{ query: createSearchFilterParams({ ...searchFilters, author: [8] }) }"
                  >
                    Baudonivia von Poitiers</VChip
                  >
                  &#32;
                  <VChip
                    color="blue lighten-4"
                    :to="{ query: createSearchFilterParams({ ...searchFilters, keyword: [33] }) }"
                  >
                    barbari</VChip
                  >
                  or
                  <VChip
                    color="amber lighten-3"
                    :to="{
                      query: createSearchFilterParams({ ...searchFilters, 'case-study': [3] }),
                    }"
                  >
                    Steppe Peoples 1: "Schwarzes Meer"</VChip
                  >
                </p>
                <p>
                  Use the <b>slider</b> below to adjust and narrow down the <b>historical</b> scope
                  of your query.
                </p>
              </div>
            </VCol>
          </VRow>

          <VRow v-else>
            <RouterView />
          </VRow>

          <VRow v-show="isSliderVisible">
            <VCol>
              <DateRangeForm />
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VContainer>
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

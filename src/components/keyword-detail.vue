<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router/composables';

import {
  useKeywordByCenturyById,
  useKeywordById,
  useKeywordGraph,
  usePassages,
  useSpatialCoveragesGeojson,
} from '@/api';
import GeoMap from '@/components/geo-map.vue';
import KeywordAuthorTab from '@/components/keyword-author-tab.vue';
import KeywordListItem from '@/components/keyword-list-item.vue';
import KeywordOverTime from '@/components/keyword-over-time.vue';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { truncate } from '@/lib/truncate';
import { useDrawerWidth } from '@/lib/use-drawer-width';
import { useFullScreen } from '@/lib/use-full-screen';
import { useStore } from '@/lib/use-store';

const route = useRoute();
const store = useStore();
// FIXME: does this really accept multiple ids? when clicking a node on the network graph it does, but this looks accidental?
// ANSWER: It should and it did, TODO: Reimplement
const id = computed(() => {
  return String(route.params.id).includes('+')
    ? String(route.params.id).split('+').map(Number)[0]!
    : Number(route.params.id);
});

const keywordQuery = useKeywordById({ id });
const keywordByCenturyQuery = useKeywordByCenturyById({ id });
const keywordGraphQuery = useKeywordGraph({ id });

const { createSearchFilterParams, searchFilters } = useSearchFilters();
const passagesQuery = usePassages(
  computed(() => {
    return {
      [searchFilters.value['query-mode'] === 'intersection' ? 'key_word_and' : 'key_word']: [
        id.value,
      ],
      // has_usecase: searchFilters.value['dataset'] === 'case-studies',
      limit: 500, // FIXME: you already know
    };
  })
);
const spatialCoveragesQuery = useSpatialCoveragesGeojson(
  computed(() => {
    return {
      [searchFilters.value['query-mode'] === 'intersection' ? 'key_word_and' : 'key_word']: [
        id.value,
      ],
    };
  })
);

const isLoading = computed(() => {
  return [
    keywordQuery,
    keywordByCenturyQuery,
    keywordGraphQuery,
    passagesQuery,
    spatialCoveragesQuery,
  ].some((query) => {
    return query.isInitialLoading.value;
  });
});

const keyword = computed(() => keywordQuery.data.value);
const keywordByCentury = computed(() => keywordByCenturyQuery.data.value);
const keywordGraph = computed(() => keywordGraphQuery.data.value);
const passages = computed(() => passagesQuery.data.value?.results ?? []);
const spatialCoverages = computed(() => spatialCoveragesQuery.data.value?.features ?? []);

// FIXME: only temporary, unclear if intentional
const keywords = computed(() => {
  if (keyword.value == null) return [];
  return [keyword.value];
});
const keywordsByCentury = computed(() => {
  if (keywordByCentury.value == null) return [];
  return [keywordByCentury.value];
});

const geography = computed(() => {
  return [{ features: spatialCoverages.value }, { features: [] }];
});

const overtime = keywordsByCentury;
const graph = keywordGraph;
const passageCount = computed(() => passagesQuery.data.value?.count);

const tab = ref(null);

function getNumbersFromString(value: string) {
  return value.replace(/\D/g, '');
}

const connections = computed(() => {
  const retArr: any[] = [];

  if (!keywords.value || !graph.value) return retArr;

  // const keyIds = this.data.keywords.map((x) => x.id);
  const edges = graph.value.edges;

  // edges = this.removeDuplicates(edges, ['source', 'target']);

  const targets = edges.map((edge) => ({ target: edge.target, count: edge.count }));
  const count: Record<string, number> = {};

  targets.forEach((target) => {
    count[target.target] = (count[target.target] ?? 0) + target.count;
  });

  Object.entries(count).forEach(([target, count]) => {
    retArr.push({
      key: target,
      id: getNumbersFromString(target),
      label: graph.value?.nodes.find((node) => node.key === target)?.label,
      count,
    });
  });

  // priorise connections with keyword in query
  // return retArr.sort((a) => (route.query?.Keyword.split('+').includes(a.id) ? -1 : 1));

  // sort by connection count
  return retArr.sort((a, b) => b.count - a.count);
});

const neighbors = computed({
  get() {
    return store.state.graphOptions.showNeighborsOnly;
  },
  set(value) {
    store.commit('setGraphParam', { key: 'showNeighborsOnly', value });
  },
});

const isFullScreen = useFullScreen();
const drawerWidth = useDrawerWidth();
const xPressLinkName = computed(() => {
  if (isFullScreen) return 'Network Graph Fullscreen';
  return 'Network Graph';
});
</script>

<template>
  <VNavigationDrawer color="background" fixed permanent right :width="drawerWidth">
    <VListItem>
      <VListItemAction>
        <RouterLink :to="{ name: xPressLinkName, query: route.query }">
          <VIcon>mdi-close</VIcon>
        </RouterLink>
      </VListItemAction>
      <VListItemContent>
        <div v-if="!isLoading">
          <VListItemTitle class="text-h5">
            {{ keywords.map((x) => x.stichwort).join(', ') }}
          </VListItemTitle>
          <VListItemSubtitle>
            Mentioned in
            <RouterLink
              :to="{
                name: isFullScreen ? 'List Fullscreen' : 'List',
                query: { ...route.query, Keyword: route.params.id },
              }"
            >
              <span v-if="passageCount">
                {{ passageCount }} passage{{ passageCount === 1 ? '' : 's' }}
                <VIcon small>mdi-link</VIcon>,
              </span>
            </RouterLink>
            <RouterLink
              :to="{
                params: { id: route.params.id },
                query: { ...route.query, Keyword: route.params.id },
              }"
            >
              show all connections<VIcon small>mdi-link</VIcon>
            </RouterLink>
          </VListItemSubtitle>
        </div>

        <VSkeletonLoader v-else type="heading, text" />
      </VListItemContent>
    </VListItem>

    <VDivider />

    <VContainer>
      <VCol>
        <VCheckbox
          v-model="neighbors"
          label="Only show keywords that are directly connected to selection"
        />
      </VCol>

      <VRow>
        <VCol>
          <VTabs v-model="tab" grow background-color="transparent">
            <VTab key="Authors">Authors</VTab>
            <VTab key="Geography">Geography</VTab>
            <VTab key="Over Time">Over Time</VTab>
          </VTabs>
          <VTabsItems v-model="tab" background-color="transparent">
            <VTabItem key="Authors">
              <KeywordAuthorTab v-if="!isLoading" :passages="passages" />
              <VSkeletonLoader v-else type="text@10" />
            </VTabItem>
            <VTabItem key="Geography">
              <GeoMap v-if="!isLoading" :data="geography" />
              <VSkeletonLoader v-else type="image@2" />
            </VTabItem>
            <VTabItem key="Over Time">
              <KeywordOverTime v-if="!isLoading" :data="overtime" />
              <VSkeletonLoader v-else type="image@2" />
            </VTabItem>
          </VTabsItems>
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <VExpansionPanels v-if="!isLoading" accordion flat>
            <VExpansionPanel v-for="conn in connections" :key="conn.id">
              <VExpansionPanelHeader>
                <span>
                  {{ keywords.map((x) => x.stichwort).join(', ') }}
                  <VIcon small>mdi-arrow-left-right</VIcon> {{ conn.label }}
                </span>
                <template #actions>
                  <VChip small>{{ conn.count }} connections</VChip>
                  <VIcon>mdi-chevron-down</VIcon>
                </template>
              </VExpansionPanelHeader>
              <VExpansionPanelContent>
                <KeywordListItem
                  :parent-nodes="keywords.map((x) => x.id)"
                  :sibling-node="conn.id"
                />
              </VExpansionPanelContent>
            </VExpansionPanel>
          </VExpansionPanels>

          <VSkeletonLoader v-else type="list-item@5" class="transparent-skeleton" />
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <template v-if="!isLoading">
            <VRow>
              <VCol>
                <VBtn
                  dark
                  color="#171d3b"
                  block
                  class="detail-button"
                  :to="{
                    name: isFullScreen ? 'List Fullscreen' : 'List',
                    query: { ...route.query, Keyword: keywords.map((x) => x.id).join('+') },
                  }"
                >
                  {{
                    truncate(
                      `Show all Passages for ${keywords.map((x) => x.stichwort).join(', ')}`,
                      40
                    )
                  }}
                </VBtn>
              </VCol>
            </VRow>

            <VRow>
              <VCol>
                <VBtn
                  light
                  outlined
                  block
                  class="detail-button"
                  :to="{
                    name: isFullScreen ? 'Keyword Detail Fullscreen' : 'Keyword Detail',
                    params: { id: route.params.id },
                    query: { ...route.query, Keyword: route.params.id },
                  }"
                >
                  Show all Connections in Graph
                </VBtn>
              </VCol>
            </VRow>
          </template>

          <VSkeletonLoader v-else type="button@2" />
        </VCol>
      </VRow>
    </VContainer>
  </VNavigationDrawer>
</template>

<style>
button.v-expansion-panel-header {
  padding: 6px;
}

.detail-button {
  padding: 5px;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.v-skeleton-loader__button {
  width: 100%;
}

.theme--light.v-expansion-panels .v-expansion-panel {
  background-color: transparent;
}

.theme--light.v-tabs-items {
  background-color: transparent;
}
</style>

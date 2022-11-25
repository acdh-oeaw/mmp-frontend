<template>
  <v-navigation-drawer permanent fixed right color="#f1f5fa" :width="drawerWidth">
    <v-list-item>
      <v-list-item-action>
        <router-link :to="{ name: xPressLinkName, query: $route.query }">
          <v-icon>mdi-close</v-icon>
        </router-link>
      </v-list-item-action>
      <v-list-item-content>
        <div v-if="!isLoading">
          <v-list-item-title class="text-h5">
            {{ keywords.map((x) => x.stichwort).join(', ') }}
          </v-list-item-title>
          <v-list-item-subtitle>
            Mentioned in
            <router-link
              :to="{
                name: isFullScreen ? 'List Fullscreen' : 'List',
                query: addParamsToQuery({ Keyword: $route.params.id }),
              }"
            >
              <span v-if="passageCount">
                {{ passageCount }} passage{{ passageCount === 1 ? '' : 's' }}
                <v-icon small>mdi-link</v-icon>,
              </span>
            </router-link>
            <router-link
              :to="{
                params: { id: $route.params.id },
                query: addParamsToQuery({ Keyword: $route.params.id }),
              }"
            >
              show all connections<v-icon small>mdi-link</v-icon>
            </router-link>
          </v-list-item-subtitle>
        </div>
        <v-skeleton-loader v-else type="heading, text" />
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-container>
      <v-row>
        <v-col>
          <v-tabs v-model="tab" grow background-color="transparent">
            <v-tab key="Over Time"> Over Time </v-tab>
            <v-tab key="Geography"> Geography </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab" background-color="transparent">
            <v-tab-item key="Over Time">
              <keyword-over-time v-if="!isLoading" :data="overtime" />
              <v-skeleton-loader v-else type="image@2" />
            </v-tab-item>
            <v-tab-item key="Geography">
              <leaflet v-if="!isLoading" :data="geography" />
              <v-skeleton-loader v-else type="image@2" />
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-expansion-panels v-if="!isLoading" accordion flat>
            <v-expansion-panel v-for="conn in connections" :key="conn.id">
              <v-expansion-panel-header>
                <span>
                  {{ keywords.map((x) => x.stichwort).join(', ') }}
                  <v-icon small>mdi-arrow-left-right</v-icon> {{ conn.label }}
                </span>
                <template #actions>
                  <v-chip small>{{ conn.count }} connections</v-chip>
                  <v-icon>mdi-chevron-down</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <keyword-list-item
                  :parent-nodes="keywords.map((x) => x.id)"
                  :sibling-node="conn.id"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-skeleton-loader v-else type="list-item@5" class="transparent-skeleton" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <template v-if="!isLoading">
            <v-row>
              <v-col>
                <v-btn
                  dark
                  color="#171d3b"
                  block
                  class="detail-button"
                  :to="{
                    name: isFullScreen ? 'List Fullscreen' : 'List',
                    query: addParamsToQuery({
                      Keyword: keywords.map((x) => x.id).join('+'),
                    }),
                  }"
                >
                  {{
                    shorten(
                      `Show all Passages for ${keywords.map((x) => x.stichwort).join(', ')}`,
                      40
                    )
                  }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  light
                  outlined
                  block
                  class="detail-button"
                  :to="{
                    name: isFullScreen ? 'Keyword Detail Fullscreen' : 'Keyword Detail',
                    params: { id: $route.params.id },
                    query: addParamsToQuery({ Keyword: $route.params.id }),
                  }"
                >
                  Show all Connections in Graph
                </v-btn>
              </v-col>
            </v-row>
          </template>
          <v-skeleton-loader v-else type="button@2" />
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import {
  useKeywordByCenturyById,
  useKeywordById,
  useKeywordGraph,
  usePassages,
  useSpatialCoveragesGeojson,
} from '@/api';
import helpers from '@/helpers';
import { useStore } from '@/lib/use-store';

import KeywordListItem from './KeywordListItem.vue';
import KeywordOverTime from './KeywordOverTime.vue';
import Leaflet from './Leaflet.vue';

export default {
  name: 'KeywordDetail',
  components: {
    KeywordListItem,
    KeywordOverTime,
    Leaflet,
  },
  mixins: [helpers],
  setup() {
    const route = useRoute();
    const store = useStore();
    // FIXME: does this really accept multiple ids? when clicking a node on the network graph it does, but this looks accidental?
    const id = computed(() =>
      route.params.id.includes('+')
        ? route.params.id.split('+').map(Number)[0]
        : Number(route.params.id)
    );

    const keywordQuery = useKeywordById({ id });
    const keywordByCenturyQuery = useKeywordByCenturyById({ id });
    const keywordGraphQuery = useKeywordGraph({ id });
    const passagesQuery = usePassages(
      computed(() => ({
        [store.state.apiParams.intersect ? 'key_word_and' : 'key_word']: id.value,
      }))
    );
    const spatialCoveragesQuery = useSpatialCoveragesGeojson(
      computed(() => ({
        // FIXME: should this respect apiParams.intersect?
        key_word: id.value,
      }))
    );

    // TODO: granular loading states
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

    return {
      isLoading,

      keywords,
      overtime: keywordsByCentury,

      graph: keywordGraph,
      passages,
      passageCount: passagesQuery.data.value?.count,
      geography,
    };
  },
  data: () => ({
    tab: null,
  }),
  computed: {
    connections() {
      const retArr = [];

      if (!this.keywords || !this.graph) return retArr;

      // const keyIds = this.data.keywords.map((x) => x.id);
      const edges = this.graph.edges.map((edge) => ({
        source: this.getNumbersFromString(edge.source),
        target: this.getNumbersFromString(edge.target),
      }));

      // edges = this.removeDuplicates(edges, ['source', 'target']);

      const targets = edges.map((edge) => edge.target);
      const count = {};

      targets.forEach((target) => {
        count[target] = count[target] ? count[target] + 1 : 1;
      });

      Object.entries(count).forEach((entry) => {
        retArr.push({
          id: entry[0],
          label: this.removeRoot(
            this.graph.nodes.filter((node) => this.getNumbersFromString(node.id) === entry[0])[0]
              .label
          ),
          count: entry[1],
        });
      });

      // priorise connections with keyword in query
      // return retArr.sort((a) => (this.$route.query?.Keyword.split('+').includes(a.id) ? -1 : 1));

      // sort by connection count
      return retArr.sort((a, b) => b.count - a.count);

      // return retArr;
    },
    xPressLinkName() {
      if (this.$route.name.includes('compare')) {
        if (this.isFullScreen) return 'Compare Authors Fullscreen';
        return 'Compare Authors';
      }
      if (this.isFullScreen) return 'Network Graph Fullscreen';
      return 'Network Graph';
    },
  },
  methods: {
    getNumbersFromString: (string) => string.replace(/\D/g, ''),
  },
};
</script>

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

<template>
  <v-navigation-drawer permanent fixed right color="#F1F5FA" :width="drawerWidth">
    <v-list-item>
      <v-list-item-action>
        <router-link :to="{ name: xPressLinkName, query: $route.query }">
          <v-icon>mdi-close</v-icon>
        </router-link>
      </v-list-item-action>
      <v-list-item-content>
        <div v-if="!loading.keywords && !loading.passages">
          <v-list-item-title class="text-h5">
            {{ data.keywords.map((x) => x.stichwort).join(', ') }}
          </v-list-item-title>
          <v-list-item-subtitle>
            Mentioned in
            <router-link
              :to="{
                name: fullscreen ? 'List Fullscreen' : 'List',
                query: addParamsToQuery({ Keyword: $route.params.id }),
              }"
            >
              <span v-if="data.passages">
                {{ data.passages.count }} passage{{ data.passages.count === 1 ? '' : 's'
                }}<v-icon small>mdi-link</v-icon>,
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
              <keyword-over-time v-if="!loading.overtime" :data="data.overtime" />
              <v-skeleton-loader v-else type="image@2" />
            </v-tab-item>
            <v-tab-item key="Geography">
              <leaflet v-if="!loading.geography" :data="data.geography" height="400" />
              <v-skeleton-loader v-else type="image@2" />
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-expansion-panels v-if="!loading.else" accordion flat>
            <v-expansion-panel v-for="conn in connections" :key="conn.id">
              <v-expansion-panel-header>
                <span>
                  {{ data.keywords.map((x) => x.stichwort).join(', ') }}
                  <v-icon small>mdi-arrow-left-right</v-icon> {{ conn.label }}
                </span>
                <template #actions>
                  <v-chip small>{{ conn.count }} connections</v-chip>
                  <v-icon>mdi-chevron-down</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <keyword-list-item
                  :parent-nodes="data.keywords.map((x) => getIdFromUrl(x.url))"
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
          <template v-if="!loading.keywords">
            <v-row>
              <v-col>
                <v-btn
                  dark
                  color="#171d3b"
                  block
                  class="detail-button"
                  :to="{
                    name: fullscreen ? 'List Fullscreen' : 'List',
                    query: addParamsToQuery({
                      Keyword: data.keywords.map((x) => x.url.replace(/\D/g, '')).join('+'),
                    }),
                  }"
                >
                  {{
                    shorten(
                      `Show all Passages for ${data.keywords.map((x) => x.stichwort).join(', ')}`,
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
                    name: fullscreen ? 'Keyword Detail Beta Fullscreen' : 'Keyword Detail Beta',
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
import helpers from '@/helpers';

import KeywordListItem from './KeywordListItem';
import KeywordOverTime from './KeywordOverTime';
import Leaflet from './Leaflet';

export default {
  name: 'KeywordDetail',
  components: {
    KeywordListItem,
    KeywordOverTime,
    Leaflet,
  },
  mixins: [helpers],
  data: () => ({
    loading: {
      keywords: true,
      overtime: true,
      else: true,
    },
    data: {
      overtime: [],
      geography: null,
      keywords: [],
      url: '',
      passages: { count: 0 },
    },
    tab: null,
  }),
  computed: {
    connections() {
      console.log('keyword connections called', this.data);
      const retArr = [];

      if (!this.data.keywords || !this.data.nodes) return retArr;

      // const keyIds = this.data.keywords.map((x) => this.getIdFromUrl(x.url));
      const edges = this.data.nodes.edges.map((edge) => ({
        source: this.getIdFromUrl(edge.source),
        target: this.getIdFromUrl(edge.target),
      }));
      // edges = this.removeDuplicates(edges, ['source', 'target']);

      const targets = edges.map((edge) => edge.target);
      const count = {};

      targets.forEach((target) => {
        count[target] = count[target] ? count[target] + 1 : 1;
      });
      console.log('keyword connections', edges, targets, count);

      Object.entries(count).forEach((entry) => {
        retArr.push({
          id: entry[0],
          label: this.removeRoot(
            this.data.nodes.nodes.filter((node) => this.getIdFromUrl(node.id) === entry[0])[0].label
          ),
          count: entry[1],
        });
      });

      console.log('connections', retArr);
      // priorise connections with keyword in query
      // return retArr.sort((a) => (this.$route.query?.Keyword.split('+').includes(a.id) ? -1 : 1));

      // sort by connection count
      return retArr.sort((a, b) => b.count - a.count);

      // return retArr;
    },
    xPressLinkName() {
      if (this.$route.name.includes('compare')) {
        if (this.fullscreen) return 'Compare Authors Fullscreen';
        return 'Compare Authors';
      }
      if (this.fullscreen) return 'Network Graph Beta Fullscreen';
      return 'Network Graph Beta';
    },
  },
  watch: {
    '$route.params': {
      handler(params) {
        console.log(params);

        // set all keys to true
        Object.keys(this.loading).forEach((x) => {
          this.loading[x] = true;
        });

        const ids = params.id.toString(10).split('+');

        // Keywords
        let urls = ids.map(
          (x) => `${import.meta.env.VITE_APP_MMP_API_BASE_URL}/api/keyword/${x}/?format=json`
        );
        let prefetched = this.$store.state.fetchedResults[urls.toString()];
        if (prefetched) {
          this.data.keywords = prefetched;
        } else {
          Promise.all(urls.map((x) => fetch(x)))
            .then((res) => {
              Promise.all(res.map((x) => x.json()))
                .then((jsonRes) => {
                  console.log('promise all keyword1', jsonRes);
                  this.$store.commit('addToResults', { req: urls.toString(), res: jsonRes });
                  this.data.keywords = jsonRes;
                })
                .catch((err) => {
                  console.error(err);
                })
                .finally(() => {
                  this.loading.keywords = false;
                });
            })
            .catch((err) => {
              console.error(err);
            });
        }

        // Overtime
        urls = ids.map(
          (x) => `${import.meta.env.VITE_APP_MMP_API_BASE_URL}/archiv/keyword/century/${x}`
        );
        prefetched = this.$store.state.fetchedResults[urls.toString()];
        if (prefetched) {
          this.data.overtime = prefetched;
        } else {
          Promise.all(urls.map((x) => fetch(x)))
            .then((res) => {
              Promise.all(res.map((x) => x.json()))
                .then((jsonRes) => {
                  console.log('promise all overtimes', jsonRes);
                  this.$store.commit('addToResults', { req: urls.toString(), res: jsonRes });
                  this.data.overtime = jsonRes;
                })
                .catch((err) => {
                  console.error(err);
                })
                .finally(() => {
                  this.loading.overtime = false;
                });
            })
            .catch((err) => {
              console.error(err);
            });
        }

        // Else
        urls = [
          `${import.meta.env.VITE_APP_MMP_API_BASE_URL}/archiv/keyword-data/?ids=${ids.join(',')}`,
          `${import.meta.env.VITE_APP_MMP_API_BASE_URL}/api/stelle/?format=json&has_usecase=${
            this.hasUsecase
          }`,
          `${import.meta.env.VITE_APP_MMP_API_BASE_URL}/api/spatialcoverage/?format=json`,
        ];

        ids.forEach((x) => {
          urls[1] += this.$store.state.apiParams.intersect
            ? `&key_word_and=${x}`
            : `&key_word=${x}`;
          urls[2] += `&key_word=${x}`;
        });

        prefetched = this.$store.state.fetchedResults[urls.toString()];
        if (prefetched) {
          [this.data.nodes, this.data.passages, , this.data.geography] = prefetched;
        } else {
          Promise.all(urls.map((x) => fetch(x)))
            .then((res) => {
              Promise.all(res.map((x) => x.json()))
                .then((jsonRes) => {
                  console.log('promise all keyword-', jsonRes);
                  this.$store.commit('addToResults', { req: urls.toString(), res: jsonRes });
                  [this.data.nodes, this.data.passages, , this.data.geography] = jsonRes;
                  console.log('keyword data', this.data);
                  // console.log('connections', this.connections);
                })
                .catch((err) => {
                  console.error(err);
                })
                .finally(() => {
                  this.loading.else = false;
                });
            })
            .catch((err) => {
              console.error(err);
            });
        }
      },
      deep: true,
      immediate: true,
    },
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

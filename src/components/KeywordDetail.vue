<template>
  <v-navigation-drawer
    permanent
    fixed
    right
    color="#F1F5FA"
    :width="drawerWidth"
  >
    <v-list-item class="keyword-header">
      <v-list-item-action>
        <router-link :to="{ name: $route.path.includes('/view/') ? 'Network Graph Fullscreen' : 'Network Graph', query: $route.query }">
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
                name: $route.path.includes('/view/') ? 'List Fullscreen' : 'List',
                query: { Keyword: $route.params.id },
              }"
            >
              {{ data.passages.count }} passage{{ data.passages.count === 1 ? '' : 's' }}<v-icon small>mdi-link</v-icon>
            </router-link>,
            <router-link
              :to="{
                name: $route.path.includes('/view/') ? 'Keyword Detail Fullscreen' : 'Keyword Detail',
                params: { id: $route.params.id },
                query: { Keyword: $route.params.id },
              }"
            >
              show all connections<v-icon small>mdi-link</v-icon>
            </router-link>
          </v-list-item-subtitle>
        </div>
        <v-skeleton-loader
          v-else
          type="heading, text"
        />
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-container>
      <v-row>
        <v-col>
          <v-tabs
            v-model="tab"
            grow
            background-color="transparent"
          >
            <v-tab key="Over Time">
              Over Time
            </v-tab>
            <v-tab key="Geography">
              Geography
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab" background-color="transparent">
            <v-tab-item key="Over Time">
              <keyword-over-time
                v-if="!loading.overtime"
                :data="data.overtime"
              />
              <v-skeleton-loader
                v-else
                type="image@2"
              />
            </v-tab-item>
            <v-tab-item key="Geography">
              <leaflet
                v-if="!loading.geography"
                :data="data.geography"
                height="400"
              />
              <v-skeleton-loader
                v-else
                type="image@2"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-expansion-panels
            v-if="!loading.else"
            accordion
            flat
          >
            <v-expansion-panel
              v-for="conn in connections"
              :key="conn.id"
            >
              <v-expansion-panel-header>
                <template v-slot:actions>
                  <v-icon class="icon">mdi-chevron-down</v-icon>
                </template>
                <span class="header">
                  {{ data.keywords.map((x) => x.stichwort).join(', ') }} <v-icon small>mdi-arrow-left-right</v-icon> {{ conn.label }}
                </span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <keyword-list-item
                  :parentNodes="data.keywords.map((x) => getIdFromUrl(x.url))"
                  :siblingNode="conn.id"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-skeleton-loader
            type="list-item@5"
            v-else
          />
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
                    name: $route.path.includes('/view/') ? 'List Fullscreen' : 'List',
                    query: { Keyword: data.keywords.map((x) => x.url.replace(/\D/g, '')).join('+') }
                  }"
                >
                  {{ shorten(`Show all Passages for ${data.keywords.map((x) => x.stichwort).join(', ')}`, 40) }}
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
                    name: $route.path.includes('/view/') ? 'Keyword Detail Fullscreen' : 'Keyword Detail',
                    params: { id: $route.params.id },
                    query: { Keyword: $route.params.id },
                  }"
                >
                  Show all Connections in Graph
                </v-btn>
              </v-col>
            </v-row>
          </template>
          <v-skeleton-loader
            type="button@2"
            v-else
          />
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
  components: {
    KeywordListItem,
    KeywordOverTime,
    Leaflet,
  },
  mixins: [helpers],
  computed: {
    connections() {
      console.log('keyword connections called', this.data);
      const retArr = [];

      if (!this.data.keywords || !this.data.nodes) return retArr;

      const keyIds = this.data.keywords.map((x) => this.getIdFromUrl(x.url));
      let edges = this.data.nodes.edges.map((edge) => ({ source: this.getIdFromUrl(edge.source), target: this.getIdFromUrl(edge.target) }));
      edges = this.removeDuplicates(edges, ['source', 'target']);

      const targets = edges.map((edge) => edge.target);
      const count = {};

      targets.forEach((target) => {
        count[target] = count[target] ? count[target] + 1 : 1;
      });

      Object.entries(count).forEach((entry) => {
        if (entry[1] === keyIds.length) {
          retArr.push({
            id: entry[0],
            label: this.removeRoot(this.data.nodes.nodes.filter((node) => this.getIdFromUrl(node.id) === entry[0])[0].label),
          });
        }
      });

      console.log('connections', retArr);
      // priorise connections with keyword in query
      // return retArr.sort((a) => (this.$route.query?.Keyword.split('+').includes(a.id) ? -1 : 1));
      return retArr;
    },
    drawerWidth() {
      const widths = {
        xs: '100vw',
        sm: '100vw',
        md: '50vw',
      };
      return widths[this.$vuetify.breakpoint.name] || '33vw';
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
        let urls = ids.map((x) => `https://mmp.acdh-dev.oeaw.ac.at/api/keyword/${x}/?format=json`);

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

        // Overtime
        urls = ids.map((x) => `https://mmp.acdh-dev.oeaw.ac.at/archiv/keyword/century/${x}`);

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

        // Else
        urls = [
          `https://mmp.acdh-dev.oeaw.ac.at/archiv/keyword-data/?ids=${ids.join(',')}`,
          'https://mmp.acdh-dev.oeaw.ac.at/api/stelle/?format=json',
          'https://mmp.acdh-dev.oeaw.ac.at/api/spatialcoverage/?format=json',
        ];

        ids.forEach((x) => {
          urls[1] += `&key_word=${x}`;
          urls[2] += `&key_word=${x}`;
        });

        Promise.all(urls.map((x) => fetch(x)))
          .then((res) => {
            Promise.all(res.map((x) => x.json()))
              .then((jsonRes) => {
                console.log('promise all keyword-', jsonRes);
                this.$store.commit('addToResults', { req: urls.toString(), res: jsonRes });
                this.data = {
                  overtime: this.data.overtime,
                  keywords: this.data.keywords,
                  nodes: jsonRes[0],
                  passages: jsonRes[1],
                  geography: jsonRes[3],
                };
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
.icon {
  order: 0;
}
.header {
  order: 1;
}
</style>

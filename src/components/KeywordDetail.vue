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
        <router-link :to="{ name: 'Network Graph', query: $route.query }">
          <v-icon>mdi-close</v-icon>
        </router-link>
      </v-list-item-action>
      <v-list-item-content v-if="true">
        <div v-if="!loading">
          <v-list-item-title class="text-h5">
            {{ data.stichwort }}
          </v-list-item-title>
          <v-list-item-subtitle>
            Mentioned in <router-link :to="{ name: 'List', query: { Keyword: data.url.replace(/d/g, '')}}">{{ data.passages.count }} passage{{ data.passages.count === 1 ? '' : 's' }}</router-link>
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
                v-if="!loading"
                :data="data.overtime"
              />
              <v-skeleton-loader
                v-else
                type="image@2"
              />
            </v-tab-item>
            <v-tab-item key="Geography">
              <leaflet
                :data="data.geography"
                v-if="!loading"
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
            v-if="!loading"
            accordion
            flat
          >
            <v-expansion-panel
              v-for="node in data.nodes.nodes"
              :key="node.id"
            >
              <v-expansion-panel-header v-if="data.stichwort !== removeRoot(node.label)">
                <template v-slot:actions>
                  <v-icon class="icon">mdi-chevron-down</v-icon>
                </template>
                <span class="header">
                  {{ data.stichwort }} <v-icon small>mdi-arrow-left-right</v-icon> {{ removeRoot(node.label) }}
                </span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <keyword-list-item
                  :parentNode="data.url.replace(/\D/g, '')"
                  :siblingNode="node.id.replace(/\D/g, '')"
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
      <v-row align="end">
        <v-col>
          <v-btn
            dark
            color="#171d3b"
            block
            :to="{ name: 'List', query: { Keyword: data.url.replace(/\D/g, '')}}"
            v-if="!loading"
          >
            Show all Passages for "{{ data.stichwort }}"
          </v-btn>
          <v-skeleton-loader
            type="button"
            v-else
          />
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import KeywordListItem from './KeywordListItem';
import KeywordOverTime from './KeywordOverTime';
import Leaflet from './Leaflet';

export default {
  name: 'KeywordDetail',
  data: () => ({
    loading: true,
    data: {
      overtime: [],
      geography: null,
      url: '',
    },
    tab: null,
  }),
  components: {
    KeywordListItem,
    KeywordOverTime,
    Leaflet,
  },
  methods: {
    removeRoot: (label) => label.split(',')[0],
  },
  computed: {
    drawerWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm':
          return '100vw';
        case 'md':
          return '50vw';
        default:
          return '33vw';
      }
    },
  },
  watch: {
    '$route.params': {
      handler(params) {
        console.log(params);
        this.loading = true;

        const urls = [
          `https://mmp.acdh-dev.oeaw.ac.at/archiv/keyword-data/?id=${params.id}`,
          `https://mmp.acdh-dev.oeaw.ac.at/api/keyword/${params.id}`,
          `https://mmp.acdh-dev.oeaw.ac.at/api/stelle/?format=json&key_word=${params.id}`,
          `https://mmp.acdh-dev.oeaw.ac.at/archiv/keyword/century/${params.id}`,
          `https://mmp.acdh-dev.oeaw.ac.at/api/spatialcoverage/?format=json&key_word=${params.id}`,
        ];

        // code for implementing multiple selected nodes
        // const urls = [
        //   'https://mmp.acdh-dev.oeaw.ac.at/archiv/keyword-data/?',
        //   'https://mmp.acdh-dev.oeaw.ac.at/api/keyword/?format=json',
        //   'https://mmp.acdh-dev.oeaw.ac.at/api/stelle/?format=json',
        // ];

        // const paramArr = params.id.split('+');
        // paramArr.forEach((x) => {
        //   urls[0] += `&id=${x}`;
        //   urls[1] += `&id=${x}`;
        //   urls[2] += `&key_word=${x}`;
        // });

        // console.log('urls', urls);

        Promise.all(urls.map((x) => fetch(x)))
          .then((res) => {
            Promise.all(res.map((x) => x.json()))
              .then((jsonRes) => {
                console.log('promise all keyword', jsonRes);
                this.data = {
                  ...jsonRes[1],
                  nodes: jsonRes[0],
                  passages: jsonRes[2],
                  overtime: jsonRes[3],
                  geography: jsonRes[4],
                };
                console.log('keyword data', this.data);
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                this.loading = false;
              });
          })
          .catch((err) => {
            console.log(err);
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

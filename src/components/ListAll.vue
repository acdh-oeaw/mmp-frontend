<template>
  <v-container>
    <v-row>
      <v-col>
        <v-tabs
          v-model="active"
          grow
        >
          <v-tab
            v-for="tab in tabs"
            :key="tab.name"
          >
            {{ tab.name }}s
          </v-tab>
        </v-tabs>
        <v-tabs-items
          v-model="active"
        >
          <v-tab-item
            v-for="(tab, i) in tabs"
            :key="tab.name"
          >
          <v-list>
            <v-list-item v-for="item in tab.items" :key="item.url">
              <v-list-item-content>
                <v-list-item-title>
                  {{ getIdFromUrl(item.url) }}: {{ item[tab.display] }}
                </v-list-item-title>
                <v-list-item-subtitle v-if="item[tab.sub]">
                  {{ item[tab.sub] }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="tab.loading || tab.next">
              <v-btn>
                <span v-if="tab.loading">loading...</span>
                <span @click="loadMore(i, tab.next)" v-else-if="tab.next">load more</span>
              </v-btn>
            </v-list-item>
          </v-list>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import helpers from '../helpers';

export default {
  name: 'ListAll',
  mixins: [helpers],
  data: () => ({
    active: 0,
    loading: true,
    tabs: [{
      name: 'Author',
      api: 'autor',
      display: 'name',
      sub: 'kommentar',
      items: [],
      loading: false,
      next: null,
    },
    {
      name: 'Passage',
      api: 'stelle',
      display: 'zitat',
      sub: 'kommentar',
      items: [],
      loading: false,
      next: null,
    },
    {
      name: 'Keyword',
      api: 'keyword',
      display: 'stichwort',
      sub: 'art',
      items: [],
      loading: false,
      next: null,
    },
    {
      name: 'Use Case',
      api: 'usecase',
      display: 'title',
      sub: 'description',
      items: [],
      loading: false,
      next: null,
    },
    {
      name: 'Place',
      api: 'ort',
      display: 'name',
      sub: 'kommentar',
      items: [],
      loading: false,
      next: null,
    }],
  }),
  methods: {
    loadMore(tab, url) {
      this.tabs[tab].loading = true;
      const prefetched = this.$store.state.fetchedResults[url];
      if (prefetched) {
        this.tabs[tab].items = this.tabs[tab].items.concat(prefetched.results);
        this.tabs[tab].next = prefetched.next;
        this.tabs[tab].loading = false;
      } else {
        fetch(url)
          .then((res) => res.json())
          .then((res) => {
            this.tabs[tab].items = this.tabs[tab].items.concat(res.results);
            this.tabs[tab].next = res.next;
            this.$store.commit('addToResults', { req: url, res });
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.tabs[tab].loading = false;
          });
      }
    },
  },
  watch: {
    active: {
      handler(val) {
        if (!this.tabs[val].items.length) {
          this.tabs[val].loading = true;
          const address = `https://mmp.acdh-dev.oeaw.ac.at/api/${this.tabs[val].api}/?format=json`;
          const prefetched = this.$store.state.fetchedResults[address];
          if (prefetched) {
            this.tabs[val].items = prefetched.results;
            this.tabs[val].next = prefetched.next;
            this.tabs[val].loading = false;
          } else {
            fetch(address)
              .then((res) => res.json())
              .then((res) => {
                this.tabs[val].items = res.results;
                this.tabs[val].next = res.next;
                this.$store.commit('addToResults', { req: address, res });
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                this.tabs[val].loading = false;
              });
          }
        }
      },
      immediate: true,
    },
  },
};
</script>

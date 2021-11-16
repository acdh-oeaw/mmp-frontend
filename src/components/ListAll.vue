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
            <v-card>
              <v-data-table
                :items="tab.items"
                :headers="tab.header"
                :loading="tab.loading"
                :server-items-length="tab.pagination.count || 50"
                disable-sort
                disable-filtering
                @update:page="updateOffset($event, i)"
                @update:items-per-page="updateLimit($event, i)"
                :footer-props="{
                  'items-per-page-options': [10, 20, 50, 100, 1000, -1]
                }"
              >
                <template v-slot:item.url="{ item }">
                  {{ getIdFromUrl(item.url) }}
                </template>
              </v-data-table>
            </v-card>
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
      items: [],
      loading: false,
      header: [
        { text: 'ID', value: 'url' },
        { text: 'Name', value: 'name' },
        { text: 'Comment', value: 'kommentar' },
      ],
      pagination: {
        offset: 0,
        limit: 10,
        count: 0,
      },
    },
    {
      name: 'Passage',
      api: 'stelle',
      items: [],
      loading: false,
      header: [
        { text: 'ID', value: 'url' },
        { text: 'Quote', value: 'zitat' },
        { text: 'Comment', value: 'kommentar' },
      ],
      pagination: {
        offset: 0,
        limit: 10,
        count: 0,
      },
    },
    {
      name: 'Keyword',
      api: 'keyword',
      items: [],
      loading: false,
      header: [
        { text: 'ID', value: 'url' },
        { text: 'Name', value: 'stichwort' },
        { text: 'Type', value: 'art' },
      ],
      pagination: {
        offset: 0,
        limit: 10,
        count: 0,
      },
    },
    {
      name: 'Use Case',
      api: 'usecase',
      items: [],
      loading: false,
      header: [
        { text: 'ID', value: 'url' },
        { text: 'Title', value: 'title' },
        { text: 'Description', value: 'description' },
      ],
      pagination: {
        offset: 0,
        limit: 10,
        count: 0,
      },
    },
    {
      name: 'Place',
      api: 'ort',
      display: 'name',
      sub: 'kommentar',
      items: [],
      loading: false,
      header: [
        { text: 'ID', value: 'url' },
        { text: 'Name', value: 'name' },
        { text: 'Comment', value: 'kommentar' },
      ],
      pagination: {
        offset: 0,
        limit: 10,
        count: 0,
      },
    }],
  }),
  methods: {
    fetchEntities(tabIndex) {
      this.tabs[tabIndex].loading = true;
      const address = `https://mmp.acdh-dev.oeaw.ac.at/api/${this.tabs[tabIndex].api}/?offset=${this.tabs[tabIndex].pagination.offset}&limit=${this.tabs[tabIndex].pagination.limit}&format=json`;
      const prefetched = this.$store.state.fetchedResults[address];
      if (prefetched) {
        this.tabs[tabIndex].items = prefetched.results;
        this.tabs[tabIndex].pagination.count = prefetched.count;
        this.tabs[tabIndex].loading = false;
      } else {
        fetch(address)
          .then((res) => res.json())
          .then((res) => {
            this.tabs[tabIndex].items = res.results;
            this.tabs[tabIndex].pagination.count = res.count;
            this.$store.commit('addToResults', { req: address, res });
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.tabs[tabIndex].loading = false;
          });
      }
    },
    updateLimit(limit, tabIndex) {
      this.tabs[tabIndex].pagination.limit = limit === -1 ? this.tabs[tabIndex].pagination.count : limit;
      this.fetchEntities(tabIndex);
    },
    updateOffset(page, tabIndex) {
      this.tabs[tabIndex].pagination.offset = (page - 1) * this.tabs[tabIndex].pagination.limit;
      this.fetchEntities(tabIndex);
    },
  },
  watch: {
    active: {
      handler(val) {
        this.fetchEntities(val);
      },
      immediate: true,
    },
  },
};
</script>

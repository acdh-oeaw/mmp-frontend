<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" xl="8" class="grey-bg">
        <v-tabs v-model="active" background-color="transparent" grow>
          <v-tab v-for="tab in tabs" :key="tab.name"> {{ tab.name }}s </v-tab>
        </v-tabs>
        <v-tabs-items v-model="active">
          <v-tab-item v-for="(tab, i) in tabs" :key="tab.name">
            <v-data-table
              :items="tab.items"
              :headers="tab.header"
              :loading="tab.loading"
              :server-items-length="tab.pagination.count || 50"
              disable-sort
              disable-filtering
              @update:page="updateOffset($event, i)"
              @update:items-per-page="updateLimit($event, i)"
              :footer-props="{ 'items-per-page-options': [10, 20, 50, 100, 1000, -1] }"
              class="data-table"
            >
              <template v-slot:item.id="{ item }">
                {{ item.id }}
              </template>
              <template v-slot:item.name="{ item }">
                <v-chip
                  v-if="'gnd_id' in item"
                  :to="{ name: 'List', query: addParamsToQuery({ Author: item.id }) }"
                  color="red lighten-3"
                >
                  {{ item.name }}&nbsp;<v-icon>mdi-chevron-right</v-icon>
                </v-chip>
                <v-chip
                  v-else
                  :to="{ name: 'List', query: addParamsToQuery({ Place: item.id }) }"
                  color="green lighten-3"
                >
                  {{ item.name }}&nbsp;<v-icon>mdi-chevron-right</v-icon>
                </v-chip>
              </template>
              <template v-slot:item.zitat="{ item }">
                <router-link :to="{ name: 'List', query: addParamsToQuery({ Passage: item.id }) }">
                  <b> {{ item.zitat }}&nbsp;<v-icon>mdi-chevron-right</v-icon> </b>
                </router-link>
              </template>
              <template v-slot:item.stichwort="{ item }">
                <v-chip
                  :to="{ name: 'List', query: addParamsToQuery({ Keyword: item.id }) }"
                  color="blue lighten-4"
                >
                  {{ item.stichwort }}&nbsp;<v-icon>mdi-chevron-right</v-icon>
                </v-chip>
              </template>
              <template v-slot:item.title="{ item }">
                <router-link
                  :to="{ name: 'Case Study', params: { id: item.id, query: $route.query } }"
                >
                  <b> {{ item.title }}&nbsp;<v-icon>mdi-chevron-right</v-icon> </b>
                </router-link>
              </template>
              <template v-slot:item.complete="{ item }">
                <v-icon v-if="$store.state.completeKeywords.includes(item.id)">
                  mdi-check-outline</v-icon
                >
              </template>
              <template v-slot:top>
                <v-container>
                  <v-text-field
                    v-model="tabs[i].filter"
                    @input="fetchEntities(i)"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                  />
                </v-container>
              </template>
            </v-data-table>
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
    tabs: [
      {
        name: 'Author',
        api: 'autor',
        filter: '',
        items: [],
        loading: false,
        header: [
          { text: 'ID', value: 'id' },
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
        filter: '',
        items: [],
        loading: false,
        header: [
          { text: 'ID', value: 'id' },
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
        filter: '',
        items: [],
        loading: false,
        header: [
          { text: 'ID', value: 'id' },
          { text: 'Name', value: 'stichwort' },
          { text: 'Type', value: 'art' },
          { text: 'Complete?', value: 'complete' },
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
        filter: '',
        items: [],
        loading: false,
        header: [
          { text: 'ID', value: 'id' },
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
        filter: '',
        items: [],
        loading: false,
        header: [
          { text: 'ID', value: 'id' },
          { text: 'Name', value: 'name' },
          { text: 'Comment', value: 'kommentar' },
        ],
        pagination: {
          offset: 0,
          limit: 10,
          count: 0,
        },
      },
    ],
  }),
  methods: {
    fetchEntities(tabIndex) {
      this.tabs[tabIndex].loading = true;
      const names = ['name', 'zitat', 'stichwort', 'title', 'name'];
      const address = `${process.env.VUE_APP_MMP_API_BASE_URL}/api/${this.tabs[tabIndex].api}/?${names[tabIndex]}=${this.tabs[tabIndex].filter}&${names[tabIndex]}_lookup=icontains&offset=${this.tabs[tabIndex].pagination.offset}&limit=${this.tabs[tabIndex].pagination.limit}&format=json`;
      const prefetched = this.$store.state.fetchedResults[address];
      if (prefetched) {
        this.tabs[tabIndex].items = prefetched.results;
        this.tabs[tabIndex].pagination.count = prefetched.count;
        this.tabs[tabIndex].loading = false;
      } else {
        fetch(address)
          .then((res) => res.json())
          .then((res) => {
            console.log('list all res', res);
            this.tabs[tabIndex].items = res.results;
            this.tabs[tabIndex].pagination.count = res.count;
            this.$store.commit('addToResults', { req: address, res });
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            this.tabs[tabIndex].loading = false;
          });
      }
    },
    updateLimit(limit, tabIndex) {
      this.tabs[tabIndex].pagination.limit =
        limit === -1 ? this.tabs[tabIndex].pagination.count : limit;
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

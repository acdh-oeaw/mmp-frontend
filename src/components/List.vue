<template>
  <v-card
    color="transparent"
    width="100%"
    flat
  >
    <v-data-table
      :items="items"
      :headers="headers"
      :loading="loading"
      :server-items-length="pagination.count"
      disable-sort
      disable-filtering
      @update:page="updateOffset"
      @update:items-per-page="updateLimit"
      class="data-table"
    >
      <template v-slot:item.text.autor="{ item }">
        <a
          v-for="author in item.text.autor"
          @click="addAuthorToInput(author)"
          :key="author.id"
        >
          {{ author.name_en }}
        </a>
      </template>
      <template v-slot:item.text.title="{ item }">
        <router-link :to="{ name: 'Passage Detail', params: { id: item.url.replace(/\D/g, '') }, query: $route.query }" class="text-decoration-none">
          <b>{{ item.text.title }}</b>
        </router-link>
      </template>
      <template v-slot:item.keywords="{ item }">
        <!-- displays unkown if neither start nor end date are defined -->
        <div
          class="keyword-chip"
          v-for="(keyword, i) in item.key_word.map((x) => x.stichwort)"
          :key="keyword"
        >
          <v-chip
            small
            color="blue lighten-4"
            @click="addKeywordToInput(item.key_word[i])"
          >
            {{ keyword }}
          </v-chip>
        </div>
      </template>
      <template v-slot:item.written="{ item }">
        <!-- displays unkown if neither start nor end date are defined -->
        {{ (item.start_date || item.end_date) ? `${item.start_date || 'unknown'} - ${item.end_date || 'unknown'}` : 'unknown' }}
      </template>
    </v-data-table>
    <router-view />
  </v-card>
</template>

<script>
export default {
  name: 'List',
  data: () => ({
    headers: [
      { text: 'Author', value: 'text.autor' },
      { text: 'Title', value: 'text.title' },
      { text: 'Label', value: 'display_label' },
      { text: 'Keywords', value: 'keywords' },
      { text: 'Written', value: 'written' },
    ],
    items: [],
    loading: false,
    pagination: {
      count: 0,
      limit: 10,
      offset: 0,
    },
    renderKey: 0,
  }),
  methods: {
    addKeywordToInput(obj) {
      this.$store.commit('addToItemsAndInput', {
        id: parseInt(obj.url.replace(/\D/g, ''), 10),
        selected_text: obj.stichwort,
        group: 'Keyword',
      });
    },
    addAuthorToInput(obj) {
      console.log(obj);
      this.$store.commit('addToItemsAndInput', {
        id: parseInt(obj.url.replace(/\D/g, ''), 10),
        selected_text: obj.name,
        group: 'Author',
      });
    },
    fetchList(query) {
      const terms = {
        Author: 'text__autor',
        Passage: 'id',
        Keyword: 'key_word',
        'Use Case': 'use_case',
      };
      let adress = `https://mmp.acdh-dev.oeaw.ac.at/api/stelle/?format=json&limit=${this.pagination.limit}&offset=${this.pagination.offset}`;
      Object.keys(query).forEach((cat) => {
        if (query[cat]) {
          console.log(query[cat]);
          const arr = query[cat].toString(10).split('+');
          arr.forEach((val) => {
            adress += `&${terms[cat]}=${val}`;
          });
        }
      });

      if (query.time) {
        if (query.time.toString().includes('+')) {
          const times = query.time.split('+');
          adress += `&start_date=${times[0]}&start_date_lookup=lt`;
          adress += `&end_date=${times[1]}&end_date_lookup=gt`;
        } else {
          adress += `&start_date=${query.time - 5}&start_date_lookup=lt`;
          adress += `&end_date=${query.time + 4}&end_date_lookup=gt`;
        }
      }

      console.log('adress', adress);

      const prefetched = this.$store.state.fetchedResults[adress];
      if (prefetched) {
        this.items = prefetched.results;
        this.pagination.count = prefetched.count;
      } else {
        this.loading = true;
        fetch(adress)
          .then((res) => res.json())
          .then((res) => {
            console.log('list-data', res);
            this.$store.commit('addToResults', { req: adress, res });
            this.items = res.results;
            this.pagination.count = res.count;
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    updateLimit(limit) {
      this.pagination.limit = limit === -1 ? this.pagination.count : limit;
      this.fetchList(this.$route.query);
    },
    updateOffset(page) {
      this.pagination.offset = (page - 1) * this.pagination.limit;
      this.fetchList(this.$route.query);
    },
  },
  watch: {
    '$route.query': {
      handler(query) {
        this.fetchList(query);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style>
  a:hover {
    text-decoration: underline;
  }
  div.v-data-table.data-table {
    background-color: transparent;
  }
  .keyword-chip {
    display: inline-block;
    margin: 1.5px;
  }
</style>

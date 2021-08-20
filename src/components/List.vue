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
      @update:page="updateOffset"
      @update:items-per-page="updateLimit"
      class="data-table"
    >
      <template v-slot:item.author="{ item }">
        <span v-for="(autor, i) in item.text.autor" :key="autor">
          <a @click="addAuthorToInput($store.state.fetchedResults[autor])" v-if="$store.state.fetchedResults[autor]" :key="renderKey">
            {{ $store.state.fetchedResults[autor].name_en }}
            <span v-if="i != item.text.autor.length - 1"></span>
          </a>
          <v-progress-circular
            size="16"
            v-else
            indeterminate
            color="primary"
          />
        </span>
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
        {{ item.start_date || item.end_date ? `${item.start_date || 'unknown'} - ${item.end_date || 'unknown'}` : 'unknown' }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>

export default {
  name: 'List',
  data: () => ({
    fetchedAuthors: {},
    headers: [
      { text: 'Author', value: 'author' },
      { text: 'Title', value: 'text.title', class: 'font-weight-bold' },
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
        id: parseInt(obj.url.replace(/[^0-9]/g, ''), 10),
        selected_text: obj.stichwort,
        group: 'Keyword',
      });
    },
    addAuthorToInput(obj) {
      this.$store.commit('addToItemsAndInput', {
        id: parseInt(obj.url.replace(/[^0-9]/g, ''), 10),
        selected_text: obj.name,
        group: 'Author',
      });
    },
    fetchAuthors(arr) {
      Promise.all(arr.map((x) => fetch(x)))
        .then((res) => {
          Promise.all(res.map((x) => x.json()))
            .then((authors) => {
              console.log('promise all authors', authors);
              authors.forEach((author) => {
                this.$store.commit('addToResults', { req: author.url, res: author });
                this.renderKey += 1;
              });
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
            });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
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
          const arr = query[cat].split('+');
          arr.forEach((val) => {
            adress += `&${terms[cat]}=${val}`;
          });
        }
      });
      console.log('adress', adress);

      const prefetched = this.$store.state.fetchedResults[adress];
      if (prefetched) {
        this.items = prefetched.results;
        this.pagination.count = prefetched.count;
        const authors = [...new Set(this.items.map((x) => x.text.autor).flat())];
        this.fetchAuthors(authors);
      } else {
        this.loading = true;
        fetch(adress)
          .then((res) => res.json())
          .then((res) => {
            console.log('list-data', res);
            this.$store.commit('addToResults', { req: adress, res });
            this.items = res.results;
            this.pagination.count = res.count;
            const authors = [...new Set(this.items.map((x) => x.text.autor).flat())];
            this.fetchAuthors(authors);
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

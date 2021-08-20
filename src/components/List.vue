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
      :key="renderKey"
      class="data-table"
    >
      <template v-slot:item.author="{ item }">
        <span v-for="autor in item.text.autor" :key="autor">
          {{ fetchedAuthors[autor] }}
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
    renderKey: 0,
  }),
  methods: {
    addKeywordToInput(obj) {
      console.log(obj);
    },
    fetchAuthors(arr) {
      Promise.all(arr.map((x) => fetch(x)))
        .then((res) => {
          Promise.all(res.map((x) => x.json()))
            .then((authors) => {
              console.log('promise all authors', authors);
              authors.forEach((author) => {
                this.fetchedAuthors[author.url] = author.name_en;
                this.renderKey += 1;
              });
            });
        });
    },
  },
  watch: {
    '$route.query': {
      handler(query) {
        this.loading = true;

        const terms = {
          Author: 'text__autor',
          Passage: 'id',
          Keyword: 'key_word',
          'Use Case': 'use_case',
        };
        let adress = 'https://mmp.acdh-dev.oeaw.ac.at/api/stelle/?format=json';
        Object.keys(query).forEach((cat) => {
          if (query[cat]) {
            const arr = query[cat].split('+');
            arr.forEach((val) => {
              adress += `&${terms[cat]}=${val}`;
            });
          }
        });
        console.log('adress', adress);
        fetch(adress)
          .then((res) => res.json())
          .then((res) => {
            console.log('list-data', res);
            this.items = res.results;

            const authors = [...new Set(this.items.map((x) => x.text.autor).flat())];
            this.fetchAuthors(authors);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style>
  div.v-data-table.data-table {
    background-color: transparent;
  }
  .keyword-chip {
    display: inline-block;
    margin: 1.5px 1.5px 3px 0;
  }
</style>

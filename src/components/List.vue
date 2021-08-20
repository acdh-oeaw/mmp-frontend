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
        <span v-for="(autor, i) in item.text.autor" :key="autor">
          <span v-if="$store.state.fetchedResults[autor]">
            {{ $store.state.fetchedResults[autor].name_en }}
            <span v-if="i != item.text.autor.length - 1"></span>
          </span>
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
    fetchAuthors(arr) {
      Promise.all(arr.map((x) => fetch(x)))
        .then((res) => {
          Promise.all(res.map((x) => x.json()))
            .then((authors) => {
              console.log('promise all authors', authors);
              authors.forEach((author) => {
                this.$store.commit('addToResults', { req: author.url, res: author });
              });
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              this.renderKey += 1;
            });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  watch: {
    '$route.query': {
      handler(query) {
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

        const prefetched = this.$store.state.fetchedResults[adress];
        if (prefetched) {
          this.items = prefetched.results;
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

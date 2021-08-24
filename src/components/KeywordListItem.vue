<template>
  <v-card
    flat
    color="rgba(0, 0, 0, 0)"
  >
    <v-list two-line>
      <v-skeleton-loader
        type="list-item-three-line@5"
        class="list-loader"
        v-if="loading"
      />
      <v-list-item v-for="text in data" :key="text.url">
        <v-list-item-title>
          {{ text.title }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ text.autor.map((x) => x.name_en).join(', ') }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-chip
            v-for="keyword in text.keywords"
            :key="keyword.url"
            class="keyword-chip"
            small
            color="blue lighten-4"
          >
            {{ keyword.stichwort }}
          </v-chip>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    data: [],
    loading: true,
  }),
  props: [
    'parentNode',
    'siblingNode',
  ],
  methods: {
    removeDuplicates(arr) {
      return arr.filter((item, index, self) => index === self.findIndex((t) => (
        t.url === item.url
      )));
    },
  },
  mounted() {
    const url = `https://mmp.acdh-dev.oeaw.ac.at/api/stelle/?key_word=${this.parentNode}&key_word=${this.siblingNode}`;

    const prefetched = this.$store.state.fetchedResults[url];
    if (prefetched) {
      const texts = prefetched.results.map((x) => ({ ...x.text, keywords: x.key_word }));
      this.data = this.removeDuplicates(texts);
    } else {
      fetch(url)
        .then((res) => res.json())
        .then((jsonRes) => {
          this.$store.commit('addToResults', { req: url, jsonRes });
          const texts = jsonRes.results.map((x) => ({ ...x.text, keywords: x.key_word }));
          this.data = this.removeDuplicates(texts);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
};
</script>

<style>
  div.list-loader > div {
    background-color: transparent !important;
  }
  .v-expansion-panel-content__wrap {
    padding-left: 0px;
  }
  .v-list-item {
    display: block;
  }
</style>

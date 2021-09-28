<template>
  <v-card
    flat
    color="rgba(0, 0, 0, 0)"
  >
    <v-list two-line>
      <v-skeleton-loader
        type="list-item-three-line@3"
        class="list-loader"
        v-if="loading"
      />
      <v-list-item v-else-if="data.length" v-for="text in data" :key="text.url" class="list-item">
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
      <v-list-item v-else>No passages found!</v-list-item>
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
    'parentNodes',
    'siblingNode',
  ],
  mounted() {
    let url = `https://mmp.acdh-dev.oeaw.ac.at/api/stelle/?key_word=${this.siblingNode}`;
    this.parentNodes.forEach((x) => {
      url += `&key_word=${x}`;
    });

    const prefetched = this.$store.state.fetchedResults[url];
    if (prefetched) {
      const texts = prefetched.results.map((x) => ({ ...x.text, keywords: x.key_word }));
      this.data = this.removeDuplicates(texts, ['url']);
    } else {
      fetch(url)
        .then((res) => res.json())
        .then((jsonRes) => {
          this.$store.commit('addToResults', { req: url, jsonRes });
          const texts = jsonRes.results.map((x) => ({ ...x.text, keywords: x.key_word }));
          this.data = this.removeDuplicates(texts, ['url']);
          console.log('Keyword List Item data', this.data);
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
  .v-list-item:not(.keyword-header) {
    display: block;
  }
  .list-item {
    margin-bottom: 10px;
  }
</style>

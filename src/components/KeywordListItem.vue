<template>
  <v-card flat color="rgba(0, 0, 0, 0)">
    <v-list two-line>
      <v-skeleton-loader type="list-item-three-line@3" class="transparent-skeleton" v-if="loading" />
      <v-list-item v-else-if="data.length" v-for="passage in data" three-line :key="passage.url" :to="{
              name: fullscreen ? 'Passage Detail Fullscreen' : 'Passage Detail',
              query: addParamsToQuery({ Passage: getIdFromUrl(passage.url) }),
              params: { id: getIdFromUrl(passage.url) }}">
        <v-list-item-content>
          <v-list-item-title>
            {{ passage.display_label }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="passage.text.autor.length">
            {{ passage.text.title }}, {{ passage.text.autor.map((x) => getOptimalName(x)).join(', ') }}
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="passage.text.jahrhundert">
            {{ passage.text.jahrhundert }} century
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon>mdi-chevron-right</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item v-else>No passages found!</v-list-item>
    </v-list>
  </v-card>
</template>
<script>
import helpers from '@/helpers';

export default {
  data: () => ({
    data: [],
    loading: true,
  }),
  props: [
    'parentNodes',
    'siblingNode',
  ],
  mixins: [helpers],
  mounted() {
    const { intersect } = this.$store.state.apiParams;
    let url = `${import.meta.env.VITE_APP_MMP_API_BASE_URL}/api/stelle/?${intersect ? 'key_word_and' : 'key_word'}=${this.siblingNode}&has_usecase=${this.hasUsecase}`;
    this.parentNodes.forEach((x) => {
      url += intersect ? `&key_word_and=${x}` : `&key_word=${x}`;
    });

    const prefetched = this.$store.state.fetchedResults[url];
    if (prefetched) {
      this.loading = false;
      // const texts = prefetched.results.map((x) => ({ ...x.text, keywords: x.key_word }));
      const passages = prefetched.results;
      console.log('stored passages', passages);
      this.data = this.removeDuplicates(passages, 'url');
    } else {
      fetch(url)
        .then((res) => res.json())
        .then((jsonRes) => {
          this.$store.commit('addToResults', { req: url, jsonRes });

          // const texts = jsonRes.results.map((x) => ({ ...x.text, keywords: x.key_word }));
          const passages = jsonRes.results;
          console.log('passages', passages);
          this.data = this.removeDuplicates(passages, 'url');
          console.log('Keyword List Item data', this.data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
};
</script>

<style>
  div.transparent-skeleton > div {
    background-color: transparent !important;
  }
  .v-expansion-panel-content__wrap {
    padding-left: 0px;
  }
  .list-item {
    margin-bottom: 10px;
  }
</style>

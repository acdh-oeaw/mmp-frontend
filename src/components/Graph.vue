<template>
  <!-- the only way to make this overlay behave the way i want it to is to use a v-card here -->
  <v-card
    color="transparent"
    width="100%"
  >
    <v-overlay
      absolute
      class="overlay"
      opacity=".1"
      :value="!nodeCount"
      >
      <h1 class="no-nodes">
        No nodes found!
      </h1>
    </v-overlay>
    <visualization
    :graph="graph"
    :onNodeClick="nodeClick"
    linkWidth="3"
    height="500" />
    <!-- <p>
      <node-details v-if="getDetails('keyword').id" />
    </p> -->
  </v-card>
</template>

<script>
import Visualization from './Visualization2D';

export default {
  name: 'Graph',
  components: {
    Visualization,
  },
  data: () => ({
    graph: null,
    loading: false,
  }),
  methods: {
    nodeClick(node) {
      console.log('node clicked', node);
    },
    debounce(func, time) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, time);
      };
    },
  },
  computed: {
    nodeCount() {
      return this.graph?.nodes?.length;
    },
  },
  watch: {
    '$route.query': {
      handler(query) {
        this.loading = true;

        const terms = {
          Author: 'rvn_stelle_key_word_keyword__text__autor',
          Passage: 'rvn_stelle_key_word_keyword',
          Keyword: 'id',
          'Use Case': 'unused',
        };
        let adress = 'https://mmp.acdh-dev.oeaw.ac.at/archiv/keyword-data/?';
        Object.keys(query).forEach((cat) => {
          console.log(cat);
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
            console.log('keyword-data', res);
            this.graph = res;
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

<style lang="css" scoped>
  .no-nodes {
    color: rgba(0, 0, 0, .87);
  }
</style>

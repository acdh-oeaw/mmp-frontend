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
      :value="!nodeCount || loading"
    >
      <h1 v-if="!loading" class="no-nodes">
        No nodes found!
      </h1>
      <h1 v-else class="no-nodes">
        <v-progress-circular
          indeterminate
          color="#0F1226"
        />
      </h1>
    </v-overlay>
    <visualization
      :graph="styledNodes"
      :onNodeClick="nodeClick"
      :nodeCanvasObjectMode="() => 'after'"
      :nodeCanvasObject="nodeObject"
      height="500"
    />
    <router-view />
  </v-card>
</template>

<script>
import Visualization from './Visualization2D';

export default {
  name: 'NetworkGraph',
  components: {
    Visualization,
  },
  data: () => ({
    graph: null,
    loading: false,
  }),
  methods: {
    removeRoot: (label) => label.split(',')[0],
    nodeObject(node, ctx, globalScale) {
      const label = this.removeRoot(node.label);
      const fontSize = 20 / globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      const textWidth = ctx.measureText(label).width;
      const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2);

      ctx.fillStyle = node.color;
      ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.fillText(label, node.x, node.y);
    },
    nodeClick(node) {
      console.log('node clicked', node);

      const q = node.detail_view_url.replace(/\D/g, '');

      // code for implementing multiple selected nodes
      // let q = this.$route.params.id;
      // const id = node.detail_view_url.replace(/[^0-9]/g, '');
      // // add or remove specific node from query
      // if (q) {
      //   q = q.split('+');
      //   if (q.includes(id)) q = q.filter((x) => x !== id);
      //   else q.push(id);
      //   q = q.join('+');
      // } else q = id;

      this.$router.push({
        name: 'KeywordDetail',
        params: { id: q },
        query: this.$route.query,
      });
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
    styledNodes() {
      const ret = this.graph;
      if (!ret) return ret;
      console.log('graph', this.graph);
      ret.edges.forEach((x) => {
        const targetNode = ret.nodes.filter((node) => node.id === x.source.id)[0];

        if (targetNode?.val) targetNode.val += 1;
        else if (targetNode) targetNode.val = 2;
      });
      return ret;
    },
  },
  watch: {
    '$route.query': {
      handler(query) {
        const terms = {
          Author: 'rvn_stelle_key_word_keyword__text__autor',
          Passage: 'rvn_stelle_key_word_keyword',
          Keyword: 'id',
          // 'Use Case': 'unused',
        };

        let adress = 'https://mmp.acdh-dev.oeaw.ac.at/archiv/keyword-data/?';
        Object.keys(terms).forEach((cat) => {
          if (query[cat]) {
            const arr = query[cat].split('+');
            arr.forEach((val) => {
              adress += `&${terms[cat]}=${val}`;
            });
          }
        });

        console.log('query.time', query.time);
        if (query.time) {
          if (query.time.toString().includes('+')) {
            const times = query.time.split('+');
            adress += `&rvn_stelle_key_word_keyword__start_date=${times[0]}&rvn_stelle_key_word_keyword__start_date_lookup=lt`;
            adress += `&rvn_stelle_key_word_keyword__end_date=${times[1]}&rvn_stelle_key_word_keyword__end_date_lookup=gt`;
          } else {
            adress += `&rvn_stelle_key_word_keyword__start_date=${query.time - 5}&rvn_stelle_key_word_keyword__start_date_lookup=lt`;
            adress += `&rvn_stelle_key_word_keyword__end_date=${query.time + 4}&rvn_stelle_key_word_keyword__end_date_lookup=gt`;
          }
        }

        console.log('adress', adress);

        const prefetched = this.$store.state.fetchedResults[adress];
        if (prefetched) {
          this.graph = prefetched;
        } else {
          this.loading = true;
          fetch(adress)
            .then((res) => res.json())
            .then((res) => {
              console.log('node-data', res);
              this.$store.commit('addToResults', { req: adress, res });
              this.graph = res;
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

<style lang="css">
  .no-nodes {
    color: rgba(0, 0, 0, .87);
  }
</style>

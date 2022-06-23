<template>
  <!-- the only way to make this overlay behave the way i want it to is to use a v-card here -->
  <v-card
    color="transparent"
    width="100%"
    height="100%"
  >
    <v-overlay
      absolute
      class="overlay"
      opacity=".2"
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
      id="visId"
      :key="renderKey"
      :graph="weightedGraph"
      :onNodeClick="nodeClick"
      :nodeCanvasObject="nodeObject"
      :nodeCanvasObjectMode="() => 'replace'"
      :height="fullscreen ? undefined : '500'"
      :zoomToFit="zoomToFit"
      :linkDirectionalArrowLength="2"
      :paused="paused"
      :nodeRelSize="4"
    />
    <router-view />
    <v-speed-dial
      v-model="fab.download"
      absolute
      top
      right
      direction="bottom"
      transition="slide-y-transition"
    >
      <template v-slot:activator>
        <v-btn
          v-model="fab.download"
          icon
          small
        >
          <v-icon v-if="fab.download">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-tray-arrow-down
          </v-icon>
        </v-btn>
      </template>
      <v-tooltip
        left
        transition="slide-x-reverse-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            @click="getCanvasData"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-image</v-icon>
          </v-btn>
        </template>
        <span>Download canvas as .png</span>
      </v-tooltip>
      <v-tooltip
        left
        transition="slide-x-reverse-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            @click="getJsonData"
            v-bind="attrs"
            v-on="on"
          >
        <v-icon>mdi-code-json</v-icon>
      </v-btn>
        </template>
        <span>Download node data as .json</span>
      </v-tooltip>
    </v-speed-dial>
    <fullscreen-button :usecase="usecase" />
    <v-speed-dial
      v-model="fab.control"
      absolute
      top
      left
      direction="bottom"
      transition="slide-y-transition"
    >
      <template v-slot:activator>
        <v-btn
          v-model="fab.control"
          icon
          small
        >
          <v-icon v-if="fab.control">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-dots-vertical
          </v-icon>
        </v-btn>
      </template>
      <v-tooltip
        right
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            disabled
            @click.stop="paused = !paused"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon v-if="!paused">mdi-pause</v-icon>
            <v-icon v-else>mdi-play</v-icon>
          </v-btn>
        </template>
        <span>{{ paused ? 'Unp' : 'P' /* hehehehe*/ }}ause Simulation</span>
      </v-tooltip>
      <v-tooltip
        right
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            @click.stop="zoomToFit = !zoomToFit"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-fit-to-screen-outline</v-icon>
          </v-btn>
        </template>
        <span>Fit Nodes to Screen</span>
      </v-tooltip>
      <v-tooltip
        right
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            @click.stop="refresh"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>Refresh Graph, unpin all nodes</span>
      </v-tooltip>
      <v-tooltip
        right
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            :to="{
              name: 'Network Graph',
              query: $route.query,
              params: $route.params,
            }"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-test-tube-empty</v-icon>
          </v-btn>
        </template>
        <span>Normal Graph</span>
      </v-tooltip>
    </v-speed-dial>
    <div
      absolute
      bottom
      left
      class="legend"
    >
      <v-list dense color="transparent">
        <v-list-item
          v-for="type in types"
          :key="type"
          dense
          style="min-height: unset"
        >
          <v-list-item-icon style="margin: 0">
            <v-icon
              :color="colors[type]"
              small
            >
              mdi-square
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content style="padding: 0">
            <v-list-item-title>
              {{ type }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </v-card>
</template>
<script>
import helpers from '@/helpers';
import Visualization from './Visualization2D';
import FullscreenButton from './FullscreenButton';

export default {
  name: 'NetworkGraphBeta',
  components: {
    Visualization,
    FullscreenButton,
  },
  data: () => ({
    colors: {
      Keyword: '#039BE5', // blue darken-1
      Ethonym: '#00897B', // teal darken-1
      Ethnonym: '#00897B', // teal darken-1
      Name: '#FFB300', // amber darken-1
      Region: '#43A047', // green darken-1
      Unsicher: 'black',
    },
    fab: {
      download: false,
      control: false,
    },
    graph: null,
    loading: false,
    paused: true,
    renderKey: 0,
    zoomToFit: true,
  }),
  props: ['usecase', 'keyword', 'passage', 'author', 'place'],
  mixins: [helpers],
  methods: {
    getCanvasData() {
      const link = document.createElement('a');
      link.download = 'graph.png';
      link.href = document.getElementById('visId').getElementsByTagName('canvas')[0].toDataURL();
      link.click();
      link.remove();
    },
    getJsonData() {
      const link = document.createElement('a');
      link.download = 'graph.json';
      link.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.graph))}`;
      link.click();
      link.remove();
    },
    lightenColor(color, amount) {
      if (!color) return color;

      let numArray = color.replace('#', '').match(/.{2}/g).map((hex) => parseInt(hex, 16));
      let revArray = numArray.map((num) => 255 - num);

      const max = Math.max(...revArray);
      const scale = (max - amount) / max;

      revArray = revArray.map((num) => Math.round(num * scale));
      numArray = revArray.map((num) => 255 - num);

      const ret = `#${numArray.map((num) => num.toString(16).padStart(2, '0')).join('')}`;
      console.log(color, ret, numArray, max, scale);
      return ret;
    },
    lightenColor2(color, percent) {
      if (!color) return color;
      let numArray = color.replace('#', '').match(/.{2}/g).map((hex) => parseInt(hex, 16));
      numArray = numArray.map((num) => Math.min(Math.round(num * (1 + percent / 100)), 255));

      const ret = `#${numArray.map((num) => num.toString(16).padStart(2, '0')).join('')}`;
      console.log(color, ret, numArray, percent);
      return ret;
    },
    lightenColor3(color, fade) {
      if (!color) return color;
      const numArray = color.replace('#', '').match(/.{2}/g).map((hex) => parseInt(hex, 16));
      return `rgba(${numArray.join(',')}, ${fade})`;
    },
    nodeObject(node, ctx, globalScale) {
      ctx.beginPath();
      const label = this.removeRoot(node.label);
      const fontSize = ((node.val || 1) / 5 + 18) / globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const typeColor = this.colors[node.keyword_type] || 'grey';

      if (this.$route.params.id?.toString(10).split('+').includes(node.id.replace(/\D/g, ''))) {
        ctx.shadowColor = typeColor;
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#F1F5FA';
        ctx.strokeStyle = typeColor;
        ctx.lineWidth = 2 / globalScale;
      } else {
        ctx.fillStyle = typeColor;
        ctx.strokeStyle = '#F1F5FA';
        ctx.lineWidth = 1.7 / globalScale;
      }

      ctx.strokeText(label, node.x, node.y);
      ctx.fillText(label, node.x, node.y);

      ctx.shadowBlur = 0;
    },
    nodeClick(node) {
      console.log('node clicked', node);

      // const q = node.detail_view_url.replace(/\D/g, '');

      // code for implementing multiple selected nodes
      let q = this.$route.params.id;
      const id = node.id.replace(/[^0-9]/g, '');
      console.log('q', q, 'id', id);
      // add or remove specific node from query
      if (q && !this.usecase) {
        q = q.split('+');
        if (q.includes(id)) q = q.filter((x) => x !== id);
        else q.push(id);
        q = q.join('+');
      } else q = id;

      if (q) {
        this.$router.push({
          name: this.fullscreen ? 'Keyword Detail Beta Fullscreen' : 'Keyword Detail Beta',
          params: { id: q },
          query: this.usecase ? { 'Use Case': this.usecase } : this.$route.query,
        });
      } else {
        this.$router.push({
          name: this.fullscreen ? 'Network Graph Beta Fullscreen' : 'Network Graph Beta',
          query: this.$route.query,
        });
      }
    },
    refresh() {
      this.graph.nodes.forEach((node) => {
        node.fx = undefined;
        node.fy = undefined;
      });
      // this.renderKey += 1;
    },
  },
  computed: {
    nodeCount() {
      return this.graph?.nodes?.length;
    },
    weightedGraph() {
      if (!this.graph) return null;
      const ret = this.graph;
      console.log('weightedGraph', ret);
      ret.edges.forEach((edge) => {
        const targetNode = ret.nodes.filter((node) => node.id === edge.source.id)[0];
        edge.color = this.lightenColor3(this.colors[targetNode?.keyword_type], 0.3) || '#D5D5D5';

        if (targetNode?.val) targetNode.val += 1;
        else if (targetNode) targetNode.val = 2;
      });

      ret.nodes.map((node) => {
        const retNode = node;
        retNode.color = this.colors[node.keyword_type];
        return retNode;
      });
      return ret;
    },
    types() {
      const ret = this.graph?.nodes?.map((x) => x.keyword_type);
      // console.log('types', ret);
      return [...new Set(ret)]; // removes duplicates
    },
  },
  watch: {
    '$route.query': {
      handler(query) {
        let address = `https://mmp.acdh-dev.oeaw.ac.at/archiv/keyword-data/?has_usecase=${this.hasUsecase}`;
        const terms = {
          Author: 'rvn_stelle_key_word_keyword__text__autor',
          Passage: 'rvn_stelle_key_word_keyword',
          // Keyword: 'id', // has been replaced with new multiple id functionality
          'Use Case': 'rvn_stelle_key_word_keyword__use_case',
          Place: 'rvn_stelle_key_word_keyword__text__autor__ort',
        };

        const props = [
          this.author,
          this.passage,
          this.keyword,
          this.usecase,
          this.place,
        ];

        console.log('map props', props);

        if (props.some((x) => x)) {
          console.debug('cloud props detected!');
          let j;
          props.forEach((prop, i) => {
            if (prop && prop !== '0') {
              console.debug('cloud prop', prop);
              if (i === 2) { // keyword
                address += `&ids=${prop.toString().split('+').join(',')}`;
              } else {
                if (i > 2) j = i - 1; // because terms is missing an element
                else j = i;
                address += `&${terms[Object.keys(terms)[j]]}=${prop}`;
              }
            }
          });
        } else {
          console.log('query', query);
          Object.keys(terms).forEach((cat) => {
            if (query[cat] && cat !== 'time') {
              const arr = query[cat].split('+');
              arr.forEach((val) => {
                address += `&${terms[cat]}=${val}`;
              });
            }
          });

          const filters = this.$store.state.searchFilters.keyword;
          if (filters.name && !filters.phrase) address += '&art=Eigenname';
          else if (!filters.name && filters.phrase) address += '&art=Schlagwort';

          if (query.Keyword) address += `&ids=${query.Keyword.replaceAll('+', ',')}`;

          console.log('query.time', query.time);
          if (query.time) {
            const key = this.$store.state.slider === 'passage' ? 'rvn_stelle_key_word_keyword' : 'rvn_stelle_key_word_keyword__text';
            if (query.time.toString().includes('+')) {
              const times = query.time.split('+');
              address += `&${key}__start_date=${times[0]}&${key}__start_date_lookup=lt`;
              address += `&${key}__end_date=${times[1]}&${key}__end_date_lookup=gt`;
            } else {
              address += `&${key}__start_date=${query.time - 5}&${key}__start_date_lookup=lt`;
              address += `&${key}__end_date=${query.time + 4}&${key}__end_date_lookup=gt`;
            }
          }
        }

        console.log('address', address);

        const prefetched = this.$store.state.fetchedResults[address];
        if (prefetched) {
          this.graph = prefetched;
        } else {
          this.loading = true;
          fetch(address)
            .then((res) => res.json())
            .then((res) => {
              console.log('node-data', res);
              this.$store.commit('addToResults', { req: address, res });
              this.graph = res;
            })
            .catch((err) => {
              console.error(err);
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
  .legend {
    width: min-content;
    position: absolute;
    bottom: 0;
  }
</style>

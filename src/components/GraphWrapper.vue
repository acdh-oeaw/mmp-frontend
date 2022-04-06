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
      :graph="styledNodes"
      :onNodeClick="nodeClick"
      :onNodeDragEnd="nodeDragEnd"
      :nodeCanvasObjectMode="() => 'after'"
      :nodeCanvasObject="nodeObject"
      :linkDirectionalArrowLength="3.5"
      :height="fullscreen ? undefined : '500'"
      :zoomToFit="zoomToFit"
      :paused="paused"
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
  name: 'NetworkGraph',
  components: {
    Visualization,
    FullscreenButton,
  },
  data: () => ({
    colors: {
      Schlagwort: '#039BE5', // blue darken-1
      Ethonym: '#00897B', // teal darken-1
      Eigenname: '#FFB300', // amber darken-1
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
    nodeDragEnd(node, translate) {
      console.log('nodeDrag', node, translate);
      node.fx = node.x;
      node.fy = node.y;
    },
    nodeObject(node, ctx, globalScale) {
      const label = this.removeRoot(node.label);
      const fontSize = 15 / globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      const textWidth = ctx.measureText(label).width;
      const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2);

      ctx.strokeStyle = 'black';

      const isSelected = this.$route.params.id?.toString(10).split('+').includes(node.id.replace(/\D/g, ''));

      if (isSelected) {
        ctx.lineWidth = 8 / globalScale;
        ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
        ctx.stroke();
      }

      ctx.fillStyle = this.colors[node.keyword_type] || 'grey';
      const rectProps = [node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions];
      ctx.fillRect(...rectProps);

      if (isSelected) {
        ctx.lineWidth = 2 / globalScale;
        ctx.strokeRect(...rectProps);
      }

      ctx.fill();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.fillText(label, node.x, node.y);
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
          name: this.fullscreen ? 'Keyword Detail Fullscreen' : 'Keyword Detail',
          params: { id: q },
          query: this.usecase ? { 'Use Case': this.usecase } : this.$route.query,
        });
      } else {
        this.$router.push({
          name: this.fullscreen ? 'Network Graph Fullscreen' : 'Network Graph',
          query: this.$route.query,
        });
      }
    },
    refresh() {
      this.graph.nodes.forEach((node) => {
        node.fx = undefined;
        node.fy = undefined;
      });
      this.renderKey += 1;
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
        x.color = this.colors[targetNode?.keyword_type] || 'grey';

        if (targetNode?.val) targetNode.val += 1;
        else if (targetNode) targetNode.val = 2;
      });
      console.log('ret', ret);
      ret.nodes = ret.nodes.map((x) => {
        x.val = Math.log(x.val) * 3;
        return x;
      });
      return ret;
    },
    types() {
      const ret = this.graph?.nodes?.map((x) => x.keyword_type);
      console.log('types', ret);
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

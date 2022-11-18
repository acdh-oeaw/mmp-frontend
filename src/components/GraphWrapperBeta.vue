<template>
  <!-- the only way to make this overlay behave the way i want it to is to use a v-card here -->
  <v-card color="transparent" width="100%" height="100%">
    <v-overlay absolute class="overlay" opacity=".2" :value="!nodeCount || loading">
      <h1 v-if="!loading" class="no-nodes">No nodes found!</h1>
      <h1 v-else class="no-nodes">
        <v-progress-circular indeterminate color="#0F1226" />
      </h1>
    </v-overlay>
    <visualization
      id="visId"
      :graph="weightedGraph"
      :on-node-click="nodeClick"
      :on-node-drag-end="nodeDragEnd"
      :node-canvas-object="nodeObject"
      :node-pointer-area-paint="areaPaint"
      :node-canvas-object-mode="() => 'replace'"
      :height="fullscreen ? undefined : '500'"
      :zoom-to-fit="zoomToFit"
      :link-directional-arrow-length="2"
      :refresh="renderKey"
      :auto-pause-redraw="false"
      :node-rel-size="4"
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
      <template #activator>
        <v-btn v-model="fab.download" icon small>
          <v-icon v-if="fab.download"> mdi-close </v-icon>
          <v-icon v-else> mdi-tray-arrow-down </v-icon>
        </v-btn>
      </template>
      <v-tooltip left transition="slide-x-reverse-transition">
        <template #activator="{ on, attrs }">
          <v-btn fab small v-bind="attrs" @click="getCanvasData" v-on="on">
            <v-icon>mdi-image-outline</v-icon>
          </v-btn>
        </template>
        <span>Download canvas as .png</span>
      </v-tooltip>
      <v-tooltip left transition="slide-x-reverse-transition">
        <template #activator="{ on, attrs }">
          <v-btn fab small v-bind="attrs" @click="getJsonData" v-on="on">
            <v-icon>mdi-code-json</v-icon>
          </v-btn>
        </template>
        <span>Download node data as .json</span>
      </v-tooltip>
      <v-tooltip left transition="slide-x-reverse-transition">
        <template #activator="{ on, attrs }">
          <v-btn fab small v-bind="attrs" @click="getTextData" v-on="on">
            <v-icon>mdi-text-box-outline</v-icon>
          </v-btn>
        </template>
        <span>Download node data as .txt</span>
      </v-tooltip>
      <v-tooltip left transition="slide-x-reverse-transition">
        <template #activator="{ on, attrs }">
          <v-btn fab small v-bind="attrs" @click="getCsvData" v-on="on">
            <v-icon>mdi-file-delimited-outline</v-icon>
          </v-btn>
        </template>
        <span>Download node data as .csv</span>
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
      <template #activator>
        <v-btn v-model="fab.control" icon small>
          <v-icon v-if="fab.control"> mdi-close </v-icon>
          <v-icon v-else> mdi-dots-vertical </v-icon>
        </v-btn>
      </template>
      <v-tooltip right transition="slide-x-transition">
        <template #activator="{ on, attrs }">
          <v-btn fab small v-bind="attrs" @click.stop="paused = !paused" v-on="on">
            <v-icon v-if="!paused">mdi-pause</v-icon>
            <v-icon v-else>mdi-play</v-icon>
          </v-btn>
        </template>
        <span>{{ paused ? 'Unp' : 'P' /* hehehehe*/ }}ause Simulation</span>
      </v-tooltip>
      <v-tooltip right transition="slide-x-transition">
        <template #activator="{ on, attrs }">
          <v-btn fab small v-bind="attrs" @click.stop="zoomToFit = !zoomToFit" v-on="on">
            <v-icon>mdi-fit-to-screen-outline</v-icon>
          </v-btn>
        </template>
        <span>Fit Nodes to Screen</span>
      </v-tooltip>
      <v-tooltip right transition="slide-x-transition">
        <template #activator="{ on, attrs }">
          <v-btn fab small v-bind="attrs" @click.stop="refresh" v-on="on">
            <v-icon>mdi-pin-off</v-icon>
          </v-btn>
        </template>
        <span>Unpin all nodes</span>
      </v-tooltip>
    </v-speed-dial>
    <div absolute bottom left class="legend">
      <v-list dense color="transparent">
        <v-list-item v-for="type in types" :key="type" dense style="min-height: unset">
          <v-checkbox
            v-model="typefilters[type]"
            :color="keyColors.graph[type]"
            :label="type"
            dense
            hide-details
          />
        </v-list-item>
      </v-list>
    </div>
  </v-card>
</template>
<script>
import helpers from '@/helpers';

import FullscreenButton from './FullscreenButton';
import Visualization from './Visualization2D';

export default {
  name: 'NetworkGraphBeta',
  components: {
    Visualization,
    FullscreenButton,
  },
  mixins: [helpers],
  props: ['usecase', 'keyword', 'passage', 'author', 'place'],
  data: () => ({
    fab: {
      download: false,
      control: false,
    },
    graph: null,
    loading: false,
    paused: true,
    typefilters: {
      Region: true,
      Ethnonym: true,
      Keyword: true,
      Name: true,
    },
    renderKey: 0,
    zoomToFit: true,
  }),
  computed: {
    nodeCount() {
      return this.graph?.nodes?.length;
    },
    weightedGraph() {
      if (!this.graph) return null;
      const ret = { ...this.graph };
      console.log(
        'weightedGraph',
        ret.edges.map((edge) => edge.target)
      );

      const blacklist = [];

      // filter by connection to selected keyword
      if (this.$route.params.id) {
        const neighborNodes = this.$route.params.id
          .split('+')
          .map((nodeId) => `archiv__keyword__${nodeId}`);
        console.log(neighborNodes);

        if (neighborNodes.length && this.$route.query.showNeighborsOnly) {
          ret.nodes = ret.nodes.filter((node) => {
            if (
              ret.edges.filter(
                (edge) =>
                  (edge.source === node.id || edge.target === node.id) &&
                  (neighborNodes.includes(edge.source) || neighborNodes.includes(edge.target))
              ).length
            )
              return true;
            blacklist.push(node.id);
            return false;
          });
        }
      }

      // filter types
      ret.nodes = ret.nodes.filter((node) => {
        if (this.typefilters[node.keyword_type]) return true;
        blacklist.push(node.id);
        return false;
      });

      console.log('blacklist, filtered', blacklist, ret.edges, ret.nodes);

      ret.edges = ret.edges.filter(
        (edge) => !blacklist.includes(edge.target.id) && !blacklist.includes(edge.source.id)
      );

      // assign weight
      ret.edges.forEach((edge) => {
        const targetNode = ret.nodes.filter((node) => node.id === edge.source.id)[0];
        edge.color =
          this.lightenColor(this.keyColors.graph[targetNode?.keyword_type], 0.3) || '#D5D5D5';

        if (targetNode?.val) targetNode.val += 1;
        else if (targetNode) targetNode.val = 2;
      });

      ret.nodes = ret.nodes.map((node) => {
        const retNode = node;
        retNode.color = this.keyColors.graph[node.keyword_type];
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
        let address = `${process.env.VUE_APP_MMP_API_BASE_URL}/archiv/keyword-data/?has_usecase=${this.hasUsecase}`;
        const terms = {
          Author: 'rvn_stelle_key_word_keyword__text__autor',
          Passage: 'rvn_stelle_key_word_keyword',
          // Keyword: 'id', // has been replaced with new multiple id functionality
          'Use Case': 'rvn_stelle_key_word_keyword__use_case',
          Place: 'rvn_stelle_key_word_keyword__text__autor__ort',
        };

        const props = [this.author, this.passage, this.keyword, this.usecase, this.place];

        console.log('map props', props);

        if (props.some((x) => x)) {
          console.debug('cloud props detected!');
          let j;
          props.forEach((prop, i) => {
            if (prop && prop !== '0') {
              console.debug('cloud prop', prop);
              if (i === 2) {
                // keyword
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
            const key =
              this.$store.state.slider === 'passage'
                ? 'rvn_stelle_key_word_keyword'
                : 'rvn_stelle_key_word_keyword__text';
            if (query.time.toString().includes('+')) {
              const times = query.time.split('+');
              address += `&${key}__start_date=${times[0]}&${key}__start_date_lookup=gt`;
              address += `&${key}__end_date=${times[1]}&${key}__end_date_lookup=lt`;
            } else {
              address += `&${key}__start_date=${query.time - 5}&${key}__start_date_lookup=gt`;
              address += `&${key}__end_date=${query.time + 4}&${key}__end_date_lookup=lt`;
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
      link.href = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(this.weightedGraph)
      )}`;
      link.click();
      link.remove();
    },
    getCsvData() {
      let csvContent = 'ID,Keyword,Type,Sources,Targets\r\n';
      const toCsv = this.weightedGraph.nodes.map((node) => {
        const csvObj = {
          ID: this.getIdFromUrl(node.id),
          Keyword: node.label.replace(',', ''),
          Type: node.keyword_type,
          Sources: [],
          Targets: [],
        };
        this.weightedGraph.edges.forEach((edge) => {
          if (edge.source.id === node.id) csvObj.Targets.push(this.removeRoot(edge.target.label));
          else if (edge.target.id === node.id)
            csvObj.Sources.push(this.removeRoot(edge.source.label));
        });
        csvObj.Targets = csvObj.Targets.join('/');
        csvObj.Sources = csvObj.Sources.join('/');
        return csvObj;
      });

      toCsv.forEach((node) => {
        csvContent += `${Object.values(node).join(',')}\r\n`;
      });

      const link = document.createElement('a');
      link.download = 'graph.csv';
      link.href = `data:text/csv;charset=utf-8,${csvContent}`;
      link.click();
      link.remove();
    },
    getTextData() {
      const list = this.weightedGraph.nodes;
      const ret = {};
      list.forEach((node) => {
        if (ret[node.keyword_type]) ret[node.keyword_type].push(node.label);
        else ret[node.keyword_type] = [node.label];
      });

      let retString = '';
      Object.entries(ret).forEach(([type, labels]) => {
        retString += `${type}s:\n`;
        retString += labels.join(',\n');
        retString += '\n\n';
      });

      const link = document.createElement('a');
      link.download = 'graph.txt';
      link.href = `data:attachment/text,${encodeURI(retString)}`;
      link.click();
      link.remove();
    },
    nodeObject(node, ctx, globalScale) {
      ctx.beginPath();
      const label = this.removeRoot(node.label);

      const fontSize = ((Math.log2(node.val) || 1) + 18) / globalScale;
      ctx.font = `${fontSize}px Roboto, Sans-Serif`;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const typeColor = this.keyColors.graph[node.keyword_type] || 'grey';

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

      node.area = [ctx.measureText(label).width, fontSize].map((n) => n + fontSize * 0.2); // for areapaint
    },
    areaPaint(node, color, ctx) {
      ctx.fillStyle = color;
      const bckgDimensions = node.area;
      return (
        bckgDimensions &&
        ctx.fillRect(
          node.x - bckgDimensions[0] / 2,
          node.y - bckgDimensions[1] / 2,
          ...bckgDimensions
        )
      );
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
    nodeDragEnd(node, translate) {
      console.log('nodeDrag', node, translate);
      node.fx = node.x;
      node.fy = node.y;
    },
    refresh() {
      this.graph.nodes.forEach((node) => {
        node.fx = undefined;
        node.fy = undefined;
      });
      this.renderKey += 1;
      console.log('nodes unpinned', this.renderKey);
    },
  },
};
</script>

<style lang="css">
.no-nodes {
  color: rgb(0 0 0 / 87%);
}

.legend {
  width: min-content;
  position: absolute;
  bottom: 0;
}

div.v-input--selection-controls__input {
  height: 0;
}
</style>

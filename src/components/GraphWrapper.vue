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
      :height="isFullScreen ? undefined : '500'"
      :zoom-to-fit="zoomToFit"
      :link-directional-particles="1"
      :link-directional-particle-width="1.7"
      :refresh="renderKey"
      :auto-pause-redraw="false"
      :node-rel-size="4"
      node-id="key"
      :force-center="() => null"
      :force-link="linkForces"
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
        <v-list-item v-for="key in types" :key="key" dense style="min-height: unset">
          <v-checkbox
            v-model="typefilters[key]"
            :color="keyColors.graph[key]"
            :label="key.charAt(0).toUpperCase() + key.slice(1)"
            dense
            hide-details
          />
        </v-list-item>
      </v-list>
    </div>
  </v-card>
</template>

<script>
import { forceLink } from 'd3';

import FullscreenButton from '@/components/FullscreenButton.vue';
import Visualization from '@/components/Visualization2D.vue';
import helpers from '@/helpers';

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
      author: true,
    },
    renderKey: 0,
    zoomToFit: true,
  }),
  computed: {
    nodeCount() {
      return this.graph?.nodes?.length;
    },
    weightedGraph() {
      // This is a tricky one. Usually, as this function gets calld, all edges have already been converted so that their targets and sources are object. If you refresh or follow a direct link, this doesnt happen. So I wrote this code expecting both cases.
      if (!this.graph) return null;
      const ret = { ...this.graph };
      const blacklist = [];

      // filter by connection to selected keyword
      if (this.$route.params.id) {
        let neighborNodes;

        if (this.$route.name.includes('Keyword Detail'))
          neighborNodes = String(this.$route.params.id)
            .split('+')
            .map((nodeId) => `keyword_${nodeId}`);
        else neighborNodes = [`autor_${this.$route.params.id}`];

        if (neighborNodes.length && this.$store.state.graphOptions.showNeighborsOnly) {
          ret.nodes = ret.nodes.filter((node) => {
            if (
              ret.edges.filter(
                (edge) =>
                  (edge.source.key === node.key ||
                    edge.target.key === node.key ||
                    edge.source === node.key ||
                    edge.target === node.key) &&
                  (neighborNodes.includes(edge.source.key) ||
                    neighborNodes.includes(edge.target.key) ||
                    neighborNodes.includes(edge.source) ||
                    neighborNodes.includes(edge.target))
              ).length
            )
              return true;
            blacklist.push(node.key);
            return false;
          });
        }
      }

      // filter types
      ret.nodes = ret.nodes.filter((node) => {
        if (this.typefilters[node.type] || this.typefilters[node.kind]) return true;
        blacklist.push(node.key);
        return false;
      });
      // Remove edges with no source or target node
      ret.edges = ret.edges.filter(
        (edge) =>
          !(
            blacklist.includes(edge.target.key) ||
            blacklist.includes(edge.source.key) ||
            blacklist.includes(edge.target) ||
            blacklist.includes(edge.source)
          )
      );
      // assign weight
      ret.edges.forEach((edge) => {
        const targetNode = ret.nodes.filter((node) =>
          [edge.source.key, edge.source].includes(node.key)
        )[0];
        edge.color =
          this.lightenColor(this.keyColors.graph[targetNode?.type], 0.3 ** edge.count) || '#D5D5D5';

        if (targetNode?.targets) targetNode.targets += edge.count || 1;
        else if (targetNode) targetNode.targets = edge.count || 1;
      });

      // color nodes
      ret.nodes = ret.nodes.map((node) => {
        const retNode = node;
        retNode.color = this.keyColors.graph[node.type] || this.keyColors.graph[node.kind];
        return retNode;
      });

      // fixate authors
      ret.nodes
        .filter((node) => node.kind === 'author')
        .forEach((node, i, authors) => {
          if (authors.length >= 2) {
            const rad = (i / authors.length) * 2 * Math.PI;
            node.fx = Math.cos(rad) * 400;
            node.fy = Math.sin(rad) * 200;
          }
        });

      return ret;
    },
    types() {
      const ret = this.graph?.nodes?.map((x) => x.type || x.kind);
      // console.log('types', ret);
      return [...new Set(ret)]; // removes duplicates
    },
  },
  watch: {
    '$route.query': {
      handler(query) {
        let address = `${
          import.meta.env.VITE_APP_MMP_API_BASE_URL
        }/archiv/keyword-author-network/?`; // TODO: Re-add has_usecase
        const { intersect } = this.$store.state.apiParams;
        const terms = {
          Author: intersect ? 'text__autor' : 'text__autor', // TODO: Re-add text__autor_and
          // Passage: 'rvn_stelle_key_word_keyword', // uses ids now
          Keyword: intersect ? 'key_word_and' : 'key_word',
          'Use Case': 'use_case',
          Place: 'ort',
        };

        const props = [this.author, this.passage, this.keyword, this.usecase, this.place];

        if (props.some((x) => x)) {
          let j;
          props.forEach((prop, i) => {
            if (prop && prop !== '0') {
              if (i === 1) {
                // passage
                address += `&ids=${String(prop).replaceAll('+', ',')}`;
              } else {
                if (i > 2) j = i - 1; // because terms is missing an element
                else j = i;
                address += `&${terms[Object.keys(terms)[j]]}=${prop}`;
              }
            }
          });
        } else {
          Object.keys(terms).forEach((cat) => {
            if (query[cat] && cat !== 'time') {
              const arr = query[cat].split('+');
              arr.forEach((val) => {
                if (cat === 'Author') address += `&author=${val}`;
                address += `&${terms[cat]}=${val}`;
              });
            }
          });

          const filters = this.$store.state.searchFilters.keyword;
          if (filters.name && !filters.phrase) address += '&art=Eigenname';
          else if (!filters.name && filters.phrase) address += '&art=Schlagwort';

          if (query.Passage) address += `&ids=${query.Keyword.replaceAll('+', ',')}`;

          if (query.time) {
            const key = this.$store.state.slider === 'passage' ? '' : 'text__';
            if (String(query.time).includes('+')) {
              const times = query.time.split('+');
              address += `&${key}start_date=${times[0]}&${key}start_date_lookup=gt`;
              address += `&${key}end_date=${times[1]}&${key}end_date_lookup=lt`;
            } else {
              address += `&${key}start_date=${query.time - 5}&${key}start_date_lookup=gt`;
              address += `&${key}end_date=${query.time + 4}&${key}end_date_lookup=lt`;
            }
          }
        }

        const prefetched = this.$store.state.fetchedResults[address];
        if (prefetched) {
          this.graph = prefetched;
        } else {
          this.loading = true;
          fetch(address)
            .then((res) => res.json())
            .then((res) => {
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
          ID: node.id,
          Keyword: node.label.replace(',', ''),
          Type: node.type,
          Sources: [],
          Targets: [],
        };
        this.weightedGraph.edges.forEach((edge) => {
          if (edge.source.key === node.key) csvObj.Targets.push(this.removeRoot(edge.target.label));
          else if (edge.target.key === node.key)
            csvObj.Sources.push(this.removeRoot(edge.source.label));
        });
        csvObj.Targets = csvObj.Targets.join('/');
        csvObj.Sources = csvObj.Sources.join('/');
        return csvObj;
      });

      toCsv.forEach((node) => {
        csvContent += `${Object.values(node).join()}\r\n`;
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
        if (ret[node.type]) ret[node.type].push(node.label);
        else ret[node.type] = [node.label];
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
      const label = node.label;

      const fontSize = ((Math.log2(node.targets) || 1) + 18) / globalScale;
      ctx.font = `${fontSize}px Roboto, Sans-Serif`;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (
        (node.kind === 'author' &&
          this.$route.name.includes('Graph Author Detail') &&
          this.$route.params.id === node.id) ||
        (node.kind !== 'author' &&
          this.$route.name.includes('Keyword Detail') &&
          String(this.$route.params.id).split('+').includes(String(node.id)))
      ) {
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#F1F5FA';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2 / globalScale;
      } else {
        ctx.fillStyle = node.color;
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
      const id = this.$route.params.id;
      const routeName = this.$route.name;
      let ret = {};

      if (node.kind === 'author') {
        if (node.id === id && routeName.includes('Graph Author Detail')) {
          ret.name = 'Network Graph';
          ret.params = {};
        } else {
          ret.name = 'Graph Author Detail';
          ret.params = { id: node.id };
        }
      } else {
        ret.name = 'Keyword Detail';
        if (routeName.includes('Graph Author Detail') || !id) ret.params = { id: node.id };
        else if (String(id).includes(node.id)) {
          ret.params = {
            id: id
              .split('+')
              .filter((x) => x !== String(node.id))
              .join('+'),
          };
          if (!ret.params.id) ret.name = 'Network Graph';
        } else ret.params = { id: [...String(id).split('+'), node.id].join('+') };
      }

      if (this.fullscreen) ret.name += ' Fullscreen';
      (ret.query = this.usecase ? { 'Use Case': this.usecase } : this.$route.query),
        this.$router.push(ret);
    },
    nodeDragEnd(node) {
      node.fx = node.x;
      node.fy = node.y;
    },
    refresh() {
      this.graph.nodes.forEach((node) => {
        node.fx = undefined;
        node.fy = undefined;
      });
      this.renderKey += 1;
    },
    linkForces() {
      if (this.$route.query.Author)
        return forceLink().strength((link) => (link.source.kind === 'author' ? 0.7 : 0));
      return forceLink();
    },
  },
};
</script>

<style>
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

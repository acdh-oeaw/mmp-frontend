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
      :value="!nodeCount || loading || !selectedAuthors.length"
    >
    <h1 v-if="loading" class="no-nodes">
      <v-progress-circular
      indeterminate
      color="#0F1226"
      />
    </h1>
    <h1 v-if="!loading" class="no-nodes">
      Select two or more authors!
    </h1>
    </v-overlay>
    <visualization
      id="visId"
      :graph="weightedGraph"
      :onNodeClick="nodeClick"
      :onNodeDragEnd="nodeDragEnd"
      :nodeCanvasObject="nodeObject"
      :nodeCanvasObjectMode="() => 'replace'"
      :height="fullscreen ? undefined : '500'"
      :zoomToFit="zoomToFit"
      :linkDirectionalArrowLength="2"
      :refresh="this.renderKey"
      :autoPauseRedraw="false"
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
      <v-tooltip
        left
        transition="slide-x-reverse-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            @click="getTextData"
            v-bind="attrs"
            v-on="on"
          >
        <v-icon>mdi-text-box</v-icon>
      </v-btn>
        </template>
        <span>Download node data as .txt</span>
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
            <v-icon>mdi-pin-off</v-icon>
          </v-btn>
        </template>
        <span>Unpin all nodes</span>
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
import Visualization from './Visualization2D';
import FullscreenButton from './FullscreenButton';

export default {
  name: 'NetworkGraphBeta',
  components: {
    Visualization,
    FullscreenButton,
  },
  data: () => ({
    fab: {
      download: false,
      control: false,
    },
    graph: null,
    loading: false,
    paused: true,
    typefilters: {
      Author: true,
      Region: true,
      Ethnonym: true,
      Keyword: true,
      Name: true,
    },
    renderKey: 0,
    zoomToFit: true,
    selectedAuthors: [],
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
    getTextData() {
      const list = this.styledNodes.nodes;
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
      const fontSize = ((node.val || 1) / 5 + 18) / globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      node.val = 1;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let typeColor = this.keyColors.graph[node.keyword_type] || 'grey';
      if (!node.isConnected) typeColor = this.lightenColor(typeColor, 0.3);

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
        if (node.type === 'Author') {
          this.$router.push({
            name: this.fullscreen ? 'Compare Authors Author Detail Fullscreen' : 'Compare Authors Author Detail',
            params: { id: q },
            query: this.usecase ? { 'Use Case': this.usecase } : this.$route.query,
          });
        } else {
          this.$router.push({
            name: this.fullscreen ? 'Compare Authors Detail Fullscreen' : 'Compare Authors Detail',
            params: { id: q },
            query: this.usecase ? { 'Use Case': this.usecase } : this.$route.query,
          });
        }
      } else {
        this.$router.push({
          name: this.fullscreen ? 'Compare Authors Detail Fullscreen' : 'Compare Authors Detail',
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
  computed: {
    nodeCount() {
      return this.graph?.nodes?.length;
    },
    weightedGraph() {
      if (!this.graph) return null;
      const ret = { ...this.graph };
      console.log('weightedGraph', ret);

      // filter types
      const blacklist = [];
      ret.nodes = ret.nodes.filter((node) => {
        if (this.typefilters[node.keyword_type]) return true;
        blacklist.push(node.id);
        return false;
      });

      console.log('blacklist', blacklist);

      ret.edges = ret.edges.filter((edge) => !blacklist.includes(edge.target.id) && !blacklist.includes(edge.source.id));

      // assign weight
      ret.edges.forEach((edge) => {
        const targetNode = ret.nodes.filter((node) => node.id === edge.source.id)[0];
        edge.color = this.lightenColor(this.keyColors.graph[targetNode?.keyword_type], 0.3) || '#D5D5D5';

        if (targetNode?.val) targetNode.val += 1;
        else if (targetNode) targetNode.val = 2;
      });

      ret.nodes.map((node) => {
        const retNode = node;
        const authorIds = [...new Set(
          ret.edges
            .filter((edge) => edge.target === node.id && edge.source.includes('author'))
            .map((edge) => edge.source),
        )];
        retNode.isConnected = authorIds.length === this.selectedAuthors.length;

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
        this.loading = 2;

        const authors = query.Author?.split('+') || [];
        if (authors.length >= 2) {
          this.selectedAuthors = authors;
          let authorData = [];
          fetch(`https://mmp.acdh-dev.oeaw.ac.at/api/autor/?format=json&ids=${authors.join(',')}`)
            .then((res) => res.json())
            .then((jsonRes) => {
              authorData = jsonRes.results;
              console.log('Author Data', authorData);
            })
            .catch((err) => {
              console.error(err);
            })
            .finally(() => {
              this.loading -= 1;
            });
          Promise.all(authors.map((x) => fetch(`https://mmp.acdh-dev.oeaw.ac.at/archiv/keyword-data/?has_usecase=${this.hasUsecase}&rvn_stelle_key_word_keyword__text__autor=${x}`)))
            .then((res) => {
              Promise.all(res.map((x) => x.json()))
                .then((jsonRes) => {
                  console.log('Author Graph Results', jsonRes);
                  let intersectedNodes = [];
                  const authorNodes = [];
                  const allEdges = [];
                  let coords = [];
                  switch (jsonRes.length) {
                    case 2:
                      coords = [[-1, -1], [1, 1]];
                      break;
                    case 3:
                      coords = [[-1, -1], [1, -1], [0, 1]];
                      break;
                    case 4:
                      coords = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
                      break;
                    default:
                      break;
                  }
                  jsonRes.forEach((json, i) => {
                    console.log('coords pre', coords);
                    if (coords.length === i) {
                      const rad = (i / jsonRes.length) * 2 * Math.PI;
                      coords.push([Math.cos(rad), Math.sin(rad)]);
                    }
                    console.log('author label data', authorData[i]?.url,
                      authors[i],
                      authorData.filter((author) => this.getIdFromUrl(author.url) === authors[i])[0]);

                    authorNodes.push({
                      id: `author_${authors[i]}`,
                      label: this.getOptimalName(authorData.filter((author) => this.getIdFromUrl(author.url) === authors[i])[0]),
                      keyword_type: 'Author',
                      fx: coords[i][0] * 500,
                      fy: coords[i][1] * 250,
                    });
                    json.nodes.forEach((node, j) => {
                      allEdges.push({
                        id: `custom_edge_${j}`,
                        target: node.id,
                        source: `author_${authors[i]}`,
                      });
                    });
                    allEdges.push(...json.edges);
                    if (i === 0) intersectedNodes = json.nodes;
                    else intersectedNodes = this.intersectArrays(intersectedNodes, json.nodes);
                    console.log('intersections', intersectedNodes);
                  });
                  const allNodes = [...authorNodes, ...intersectedNodes];
                  const nodeIds = allNodes.map((x) => x.id);
                  const filteredEdges = allEdges.filter((edge) => nodeIds.includes(edge.target) && nodeIds.includes(edge.source));
                  console.log('filters', nodeIds, allNodes, filteredEdges);

                  this.graph = {
                    edges: filteredEdges,
                    nodes: allNodes,
                  };
                })
                .catch((err) => {
                  console.error(err);
                })
                .finally(() => {
                  this.loading -= 1;
                });
            });
        } else {
          this.selectedAuthors = [];
          this.loading = false;
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

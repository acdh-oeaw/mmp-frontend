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
      <h1 v-if="!loading" class="no-nodes">
        Select two or more authors!
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
          <v-list-item-icon style="margin: 0">
            <v-icon
              :color="keyColors.graph[type]"
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
    fab: {
      download: false,
      control: false,
    },
    graph: null,
    loading: false,
    paused: true,
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
        edge.color = this.lightenColor(this.keyColors.graph[targetNode?.keyword_type], 0.3) || '#D5D5D5';

        if (targetNode?.val) targetNode.val += 1;
        else if (targetNode) targetNode.val = 2;
      });

      ret.nodes.map((node) => {
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
        const authors = query.Author.split('+');
        if (authors.length >= 2) {
          this.selectedAuthors = authors;
          Promise.all(authors.map((x) => fetch(`https://mmp.acdh-dev.oeaw.ac.at/archiv/keyword-data/?has_usecase=${this.hasUsecase}&rvn_stelle_key_word_keyword__text__autor=${x}`)))
            .then((res) => {
              Promise.all(res.map((x) => x.json()))
                .then((jsonRes) => {
                  console.log('Author Graph Results', jsonRes);
                  const allNodes = [];
                  const allEdges = [];
                  jsonRes.forEach((json, i) => {
                    allNodes.push({
                      id: `author_${authors[i]}`,
                      label: `Author ${i + 1}`,
                      keyword_type: 'Author',
                    });
                    json.nodes.forEach((node, j) => {
                      allEdges.push({
                        id: `custom_edge_${j}`,
                        target: node.id,
                        source: `author_${authors[i]}`,
                      });
                    });
                    allNodes.push(...json.nodes);
                    allEdges.push(...json.edges);

                    this.graph = {
                      edges: allEdges,
                      nodes: this.removeDuplicates(allNodes, 'id'),
                    };
                    console.log('New Graph', this.graph);
                  });
                })
                .catch((err) => {
                  console.error(err);
                })
                .finally(() => {
                  this.loading = false;
                });
            });
        } else this.selectedAuthors = [];
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

<template>
  <div>
    <v-btn @click="logSize()">Log Size</v-btn>
    <div ref="visWrapper" class="visualization" />
  </div>
</template>

<script>
import ForceGraph from 'force-graph';

// eslint-disable-next-line
const d3 = require('d3'); // import wasnt working here

export default {
  name: 'Visualization',
  data: () => ({
    graphDom: null,
  }),
  props: {
    backgroundColor: String,
    dagMode: {
      type: String,
      default: null,
    },
    graph: Object,
    linkDirectionalArrowLength: Number,
    linkDirectionalArrowRelPos: Number,
    linkDirectionalParticles: Number,
    linkDirectionalParticleSpeed: Number,
    linkWidth: String,
    nodeCanvasObject: Function,
    nodeCanvasObjectMode: Function,
    nodePointerAreaPaint: Function,
    onNodeClick: Function,
    onNodeDrag: Function,
    onNodeDragEnd: Function,
    onSimulationEnd: Function,
    onSimulationTick: Function,
    paused: Boolean,
    selectedNodeIds: Set, // TODO
    showNeighborsOnly: {
      type: Boolean,
      default: false,
    }, // TODO
    width: String,
    height: String,
    zoomToFit: {
      type: Boolean,
      default: false,
    },

  },
  methods: {
    transformedData(obj) {
      const sorted = {
        nodes: [...obj.nodes].sort((a, b) => b.val - a.val),
        links: obj.edges,
      };
      console.log('transformedData', obj, sorted.nodes.map((x) => x.val));
      return sorted;
    },
    addColorAndType(arr, typeArr) {
      // console.log('typeArr', typeArr, 'arr', arr);
      const retArr = arr.map((node) => {
        const retNode = node;
        const nodeType = typeArr.filter((type) => type.id === node.type)[0];
        if (nodeType) {
          retNode.color = nodeType.color;
        }
        return retNode;
      });
      return retArr;
    },
    setCanvas() {
      console.log('Setting Canvas');
      this.graphDom
        .nodeLabel('label')
        .height(this.height || undefined)
        .width(this.width || this.$refs.visWrapper.clientWidth)
        .backgroundColor(this.backgroundColor || null)
        .dagMode(this.dagMode)
        .onNodeClick(this.onNodeClick)
        .onNodeDrag(this.onNodeDrag)
        .onNodeDragEnd(this.onNodeDragEnd)
        .onEngineStop(this.onSimulationEnd)
        .onEngineTick(this.onEngineEnd)
        .linkWidth(parseFloat(this.linkWidth) || 1)
        .linkDirectionalParticles(this.linkDirectionalParticles || 0)
        .linkDirectionalParticleSpeed(this.linkDirectionalParticleSpeed || 0.01)
        .linkDirectionalArrowLength(this.linkDirectionalArrowLength || 0)
        .linkDirectionalArrowRelPos(this.linkDirectionalArrowRelPos || 0.5)
        .graphData(this.transformedData(this.graph || {
          nodes: [],
          edges: [],
          types: {
            nodes: [],
            edges: [],
          },
        }))
        .d3Force('collide', d3.forceCollide().radius((d) => d.val + 20).iterations(3))
        .nodeRelSize(this.nodeRelSize || 4)
        .nodeCanvasObject(this.nodeCanvasObject)
        .nodeCanvasObjectMode(this.nodeCanvasObjectMode)
        .nodePointerAreaPaint(this.nodePointerAreaPaint);

      console.log('speed', this.graphDom.linkDirectionalParticleSpeed());
    },
    logSize() {
      console.log('ref', this.$refs.visWrapper.clientWidth);
    },
  },
  computed: {
    windowSize() {
      const ref = this.$refs?.visWrapper?.clientWidth;
      console.log('ref size', ref);
      return ref;
    },
  },
  watch: {
    graph(val) {
      this.graphDom.graphData(this.transformedData(val));
    },
    paused(val) {
      if (val) this.graphDom.pauseAnimation();
      else this.graphDom.resumeAnimation();
    },
    zoomToFit() { // cheap workaraound, change zoomToFit to !zoomToFit to zoom (to fit)
      this.graphDom.zoomToFit(500);
    },
    '$route.name': {
      handler() {
        this.graphDom.resumeAnimation();
      },
    },
  },
  mounted() {
    console.log('Graph mounted, data:', this.graph);
    this.graphDom = ForceGraph()(this.$refs.visWrapper);
    this.setCanvas();

    console.log('d3', d3);
  },
};
</script>

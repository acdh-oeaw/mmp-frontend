<template>
  <div id="parentDiv">
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
    forceCenter: Function,
    forceLink: Function,
    forceCollision: Function,
    linkDirectionalArrowLength: Number,
    linkDirectionalArrowRelPos: Number,
    linkDirectionalParticles: Number,
    linkDirectionalParticleSpeed: Number,
    linkDirectionalParticleWidth: Number,
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
    refresh: Number,
    autoPauseRedraw: {
      type: Boolean,
      default: true,
    },
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
      // console.log('transformedData', obj, sorted.nodes.map((x) => x.val));
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
        .width(this.width || undefined)
        .backgroundColor(this.backgroundColor || null)
        .dagMode(this.dagMode)
        .onNodeClick(this.onNodeClick)
        .onNodeDrag(this.onNodeDrag)
        .onNodeDragEnd(this.onNodeDragEnd)
        .onEngineStop(this.onSimulationEnd)
        .onEngineTick(this.onEngineEnd)
        .autoPauseRedraw(this.autoPauseRedraw)
        .linkWidth(parseFloat(this.linkWidth) || 1)
        .linkDirectionalParticles(this.linkDirectionalParticles || 0)
        .linkDirectionalParticleSpeed(this.linkDirectionalParticleSpeed || 0.01)
        .linkDirectionalParticleWidth(this.linkDirectionalParticleWidth || 4)
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
        // .d3Force('collide', d3.forceCollide().radius((d) => d.val + 20).iterations(3))
        .nodeRelSize(this.nodeRelSize || 1)
        .nodeCanvasObject(this.nodeCanvasObject)
        .nodeCanvasObjectMode(this.nodeCanvasObjectMode)
        .nodePointerAreaPaint(this.nodePointerAreaPaint);

      if (this.forceCenter !== undefined) this.graphDom.d3Force('center', this.forceCenter());
      if (this.forceLink !== undefined) this.graphDom.d3Force('link', this.forceLink());
      if (this.forceCollision !== undefined) this.graphDom.d3Force('collide', this.forceCollision());

      console.log('speed', this.graphDom.linkDirectionalParticleSpeed());
    },
    logSize() {
      console.log('ref', this.$refs.visWrapper.clientWidth);
    },
  },
  watch: {
    graph: {
      handler(val) {
        this.graphDom.graphData(this.transformedData(val));
      },
      deep: true,
    },
    refresh() {
      console.log('refresh called');
      this.graphDom.d3ReheatSimulation();
    },
    zoomToFit() { // cheap workaraound, change zoomToFit to !zoomToFit to zoom (to fit)
      this.graphDom.zoomToFit(500);
    },
  },
  mounted() {
    console.log('Graph mounted, data:', this.graph);
    // console.log('forceCollision:', this.forceCollision(), 'lel', d3.forceCollide());
    console.log('forcelink', d3.forceLink);
    this.graphDom = ForceGraph()(this.$refs.visWrapper);
    this.setCanvas();

    // resize canvas on div resize
    const sizeOberserver = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      // console.log('resize detected', rect.width, rect.height);
      this.graphDom
        .width(rect.width)
        .height(rect.height);
    });

    sizeOberserver.observe(this.$refs.visWrapper);
  },
};
</script>

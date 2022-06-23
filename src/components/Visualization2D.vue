<template>
  <div ref="visWrapper" class="visualization" />
</template>

<script>
import ForceGraph from 'force-graph';

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
    highlightedNodeIds: Set, // TODO
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
        nodes: obj.nodes.sort((a, b) => a.val - b.val),
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
        .nodeRelSize(this.nodeRelSize || 4)
        .nodeCanvasObject(this.nodeCanvasObject)
        .nodeCanvasObjectMode(this.nodeCanvasObjectMode)
        .nodePointerAreaPaint(this.nodePointerAreaPaint);
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
  },
  mounted() {
    console.log('Graph mounted, data:', this.graph);
    this.graphDom = ForceGraph()(this.$refs.visWrapper);
    this.setCanvas();
  },
};
</script>

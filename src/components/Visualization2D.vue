<template>
  <div ref="visWrapper" class="visualization" />
</template>

<script>
import ForceGraph from 'force-graph';

export default {
  name: 'Visualization',
  data() {
    return {
    };
  },
  props: {
    backgroundColor: String,
    dagMode: {
      type: String,
      default: null,
    },
    graph: Object,
    highlightedNodeIds: Set, // TODO
    linkWidth: String,
    nodeCanvasObject: Function,
    nodeCanvasObjectMode: String,
    onNodeClick: Function,
    onSimulationEnd: Function,
    onSimulationTick: Function,
    onZoom: Function,
    selectedNodeIds: Set, // TODO
    showNeighborsOnly: {
      type: Boolean,
      default: false,
    }, // TODO
    width: String,
    height: String,

  },
  methods: {
    getIdFromUrl: (url) => url?.replace(/\D/g, ''),
    transformedData(obj) {
      return {
        nodes: this.addColorAndType(obj.nodes, obj.types.nodes),
        links: this.addColorAndType(obj.edges, obj.types.edges),
      };
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
      const graphDom = ForceGraph()(this.$refs.visWrapper);

      graphDom
        .nodeLabel('label')
        .height(this.height || this.$refs.visWrapper.clientHeight)
        .width(this.width || this.$refs.visWrapper.clientWidth)
        .backgroundColor(this.backgroundColor || null)
        .dagMode(this.dagMode)
        .onNodeClick(this.onNodeClick)
        .onEngineStop(this.onSimulationEnd)
        .onEngineTick(this.onEngineEnd)
        .onZoom(this.onZoom)
        .linkWidth(parseFloat(this.linkWidth) || 1)
        .linkDirectionalParticles(2)
        .graphData(this.transformedData(this.graph || {
          nodes: [],
          edges: [],
          types: {
            nodes: [],
            edges: [],
          },
        }))
        .nodeCanvasObject(this.nodeCanvasObject)
        .nodeCanvasObjectMode(this.nodeCanvasObjectMode)
        .cooldownTicks(100)
        .onEngineStop(() => graphDom.zoomToFit(400));
    },
  },
  watch: {
    graph(val) {
      console.log('graph changed, data:', val);
      this.setCanvas();
    },
  },
  mounted() {
    console.log('Graph mounted, data:', this.graph);
    this.setCanvas();
  },
};
</script>
<style scoped>
</style>

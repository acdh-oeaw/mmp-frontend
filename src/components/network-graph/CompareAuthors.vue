<script lang="ts" setup>
import { useQueries } from '@tanstack/vue-query';
import { forceLink } from 'd3';
import type { CanvasCustomRenderFn, CanvasPointerAreaPaintFn, NodeObject } from 'force-graph';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

import { createKey, getAuthorById, getKeywordGraph } from '@/api';
import FullscreenButton from '@/components/FullscreenButton.vue';
import Visualization from '@/components/network-graph/network-graph.vue';
import { getAuthorLabel } from '@/lib/get-label';
import { nodeColors, nodeTypeLabels } from '@/lib/network-graph/network-graph.config';
import type {
  GraphData,
  GraphEdge,
  GraphNode,
  GraphNodeType,
} from '@/lib/network-graph/network-graph.types';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { unique } from '@/lib/unique';
import { useFullScreen } from '@/lib/use-full-screen';

const props = defineProps<{
  usecase?: any;
  keyword?: any;
  passage?: any;
  author?: any;
  place?: any;
}>();

const route = useRoute();
const router = useRouter();
const { searchFilters, createSearchFilterParams } = useSearchFilters();

const fab = ref({
  download: false,
  control: false,
});
const paused = ref(true);
const typefilters = ref<Record<GraphNodeType, boolean>>({
  autor: true,
  Region: true,
  Ethnonym: true,
  Keyword: true,
  Name: true,
  unclear: false,
});
const renderKey = ref(0);
const zoomToFit = ref(true);

const selectedAuthors = computed(() =>
  searchFilters.value['author'].length >= 2 ? searchFilters.value['author'] : []
);

// TODO: move to @/api/hooks
const authorQueries = useQueries({
  queries: computed(() => {
    return selectedAuthors.value.map((id) => {
      const params = { id };

      return {
        queryKey: createKey('author', 'by-id', params),
        queryFn() {
          return getAuthorById(params);
        },
      };
    });
  }),
});

// TODO: move to @/api/hooks
const keywordGraphQueries = useQueries({
  queries: computed(() => {
    return selectedAuthors.value.map((id) => {
      const searchParams = {
        has_usecase: searchFilters.value['dataset'] === 'case-studies',
        text__autor: [id],
      };

      return {
        queryKey: createKey('keyword', 'list', searchParams, 'graph'),
        queryFn() {
          return getKeywordGraph(searchParams);
        },
      };
    });
  }),
});

const isLoading = computed(() => {
  // note: useQueries returns reactive readonly array, not a ref!
  return (
    authorQueries.some((query) => query.isInitialLoading) ||
    keywordGraphQueries.some((query) => query.isInitialLoading)
  );
});

const graph = computed(() => {
  const graph: GraphData = { edges: [], nodes: [] };

  if (isLoading.value) return graph;

  function getCoordinates(): Array<[number, number]> {
    switch (selectedAuthors.value.length) {
      case 2:
        return [
          [-1, -1],
          [1, 1],
        ];
      case 3:
        return [
          [-1, -1],
          [1, -1],
          [0, 1],
        ];
      case 4:
        return [
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ];
      default:
        return [];
    }
  }

  const coords = getCoordinates().map(([x, y]) => {
    return [x * 150, y * 60] as [number, number];
  });

  // FIXME: when was this ever called?
  // if (coords.length === i) {
  //   const rad = (i / jsonRes.length) * 2 * Math.PI;
  //   coords.push([Math.cos(rad), Math.sin(rad)]);
  // }

  const nodesById = new Map<GraphNode['id'], GraphNode>();
  const edgesById = new Map<GraphEdge['id'], GraphEdge>();

  selectedAuthors.value.forEach((id, index) => {
    const authorQuery = authorQueries[index];
    const author = authorQuery?.data;

    const keywordGraphQuery = keywordGraphQueries[index];
    const keywordGraph = keywordGraphQuery?.data;

    if (author == null || keywordGraph == null) return;

    const authorId = ['author', author.id].join('__');
    nodesById.set(authorId, {
      id: authorId,
      label: getAuthorLabel(author),
      type: 'autor',
      fx: coords[index]![0],
      fy: coords[index]![1],
    });

    keywordGraph.nodes.forEach((node) => {
      const id = node.id;
      nodesById.set(id, {
        id,
        label: node.label,
        type: node.keyword_type,
      });

      const source = authorId;
      const target = id;
      const edgeId = [source, target].join('__');
      edgesById.set(edgeId, { id: edgeId, source, target });
    });

    keywordGraph.edges.forEach((edge) => {
      // FIXME: does that mean we don't care about edges which are not connected to an author node?
      const id = [authorId, edge.id].join('__');
      edgesById.set(id, { ...edge, id });
    });
  });

  return {
    edges: Array.from(edgesById.values()),
    nodes: Array.from(nodesById.values()),
  };
});

const nodeCount = computed(() => {
  return graph.value.nodes.length;
});

const weightedGraph = computed(() => {
  // FIXME:
  const ret = JSON.parse(JSON.stringify(graph.value));

  // filter types
  const blacklist: Array<any> = [];

  ret.nodes = ret.nodes.filter((node) => {
    if (typefilters.value[node.type]) return true;
    blacklist.push(node.id);
    return false;
  });

  ret.edges = ret.edges.filter(
    (edge) => !blacklist.includes(edge.target) && !blacklist.includes(edge.source)
  );

  // assign weight
  ret.edges.forEach((edge) => {
    const targetNode = ret.nodes.find((node) => node.id === edge.source);

    edge.color = targetNode.type === 'autor' ? '#F85' : '#CCC';

    if (targetNode?.conns) {
      targetNode.conns += 1;
    } else if (targetNode) {
      targetNode.conns = 2;
    }
  });

  ret.nodes.map((node) => {
    const retNode = node;
    const authorIds = unique(
      ret.edges
        .filter((edge) => edge.target === node.id && edge.source.includes('author'))
        .map((edge) => edge.source)
    );

    retNode.isConnected = authorIds.length === selectedAuthors.value.length;

    retNode.color = nodeColors[node.type];

    return retNode;
  });

  return ret;
});

const types = computed(() => {
  const types = new Set<GraphNodeType>();
  graph.value.nodes.forEach((node) => types.add(node.type));
  return Array.from(types);
});

// FIXME:
watch(weightedGraph, () => {
  setTimeout(() => {
    zoomToFit.value = !zoomToFit.value;
  }, 2000);
});

function getCanvasData() {
  const link = document.createElement('a');
  link.download = 'graph.png';
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  link.href = document.getElementById('visId')!.getElementsByTagName('canvas')![0]!.toDataURL();
  link.click();
  link.remove();
}

function getJsonData() {
  const link = document.createElement('a');
  link.download = 'graph.json';
  link.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(graph.value))}`;
  link.click();
  link.remove();
}

function getCsvData() {
  let csvContent = 'ID,Keyword,Authors,Type,Sources,Targets\r\n';
  const toCsv = weightedGraph.value.nodes.map((node) => {
    const csvObj = {
      ID: node.id.replace(/\D/g, ''),
      Keyword: node.label.replace(',', ''),
      Authors: [],
      Type: node.keyword_type,
      Sources: [],
      Targets: [],
    };
    if (!node.keyword_type.includes('author')) {
      weightedGraph.value.edges.forEach((edge) => {
        if (edge.source.id === node.id) csvObj.Targets.push(removeRoot(edge.target.label));
        else if (edge.target.id === node.id) {
          if (edge.source.keyword_type === 'Author') csvObj.Authors.push(edge.source.label);
          else csvObj.Sources.push(removeRoot(edge.source.label));
        }
      });
    }
    csvObj.Targets = unique(csvObj.Targets).join('/');
    csvObj.Sources = unique(csvObj.Sources).join('/');
    csvObj.Authors = unique(csvObj.Authors).join('/');

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
}

function getTextData() {
  const list = styledNodes.value.nodes;
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
}

const nodeObject: CanvasCustomRenderFn<NodeObject> = function nodeObject(node, ctx, globalScale) {
  ctx.beginPath();

  const label = removeRoot(node.label);

  const fontSize = ((Math.log2(node.conns) || 1) + 18) / globalScale;
  ctx.font = `${fontSize}px 'Roboto FlexVariable', system-ui, sans-serif`;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let typeColor = nodeColors[node.type] || 'grey';
  if (!node.isConnected && node.type !== 'autor') {
    typeColor = lightenColor(typeColor, 0.3);
  }

  if (route.params.id?.toString(10).split('+').includes(node.id.replace(/\D/g, ''))) {
    ctx.shadowColor = typeColor;
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#F1F5FA';
    ctx.strokeStyle = typeColor;
    ctx.lineWidth = 2 / globalScale;
  } else {
    ctx.fillStyle = typeColor;
    ctx.strokeStyle = node.isConnected ? '#F1F5FA' : lightenColor('#F1F5FA', 0.3);
    ctx.lineWidth = 1.7 / globalScale;
  }

  ctx.strokeText(label, node.x, node.y);
  ctx.fillText(label, node.x, node.y);

  ctx.shadowBlur = 0;

  node.area = [ctx.measureText(label).width, fontSize].map((n) => n + fontSize * 0.2); // for areapaint
};

const areaPaint: CanvasPointerAreaPaintFn<NodeObject> = function areaPaint(node, color, ctx) {
  ctx.fillStyle = color;
  const bckgDimensions = node.area;
  return (
    bckgDimensions &&
    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions)
  );
};

function nodeClick(node: NodeObject) {
  // const q = node.detail_view_url.replace(/\D/g, '');

  // code for implementing multiple selected nodes
  let q = route.params.id;
  const id = node.id.replace(/[^0-9]/g, '');

  if (node.keyword_type === 'Author') {
    router.push({
      name: isFullScreen.value
        ? 'Compare Authors Author Detail Fullscreen'
        : 'Compare Authors Author Detail',
      params: { id: q },
      query: props.usecase
        ? createSearchFilterParams({ ...searchFilters.value, 'case-study': [props.usecase] })
        : route.query,
    });
  }

  // add or remove specific node from query
  if (q && !props.usecase) {
    q = q.split('+');
    if (q.includes(id)) q = q.filter((x) => x !== id);
    else q.push(id);
    q = q.join('+');
  } else q = id;

  if (q) {
    router.push({
      name: isFullScreen.value ? 'Compare Authors Detail Fullscreen' : 'Compare Authors Detail',
      params: { id: q },
      query: props.usecase
        ? createSearchFilterParams({ ...searchFilters.value, 'case-study': [props.usecase] })
        : route.query,
    });
  } else {
    router.push({
      name: isFullScreen.value ? 'Compare Authors Detail Fullscreen' : 'Compare Authors Detail',
      query: route.query,
    });
  }
}

function nodeDragEnd(node: NodeObject) {
  node.fx = node.x;
  node.fy = node.y;
}

function refresh() {
  graph.value.nodes.forEach((node) => {
    node.fx = undefined;
    node.fy = undefined;
  });

  renderKey.value += 1;
}

function linkForces() {
  return forceLink().strength((link) => (link.source.id.includes('author') ? 0.7 : 0));
}

function lightenColor(color: string | undefined, fade: string) {
  if (!color) return color;
  const numArray = color
    .replace('#', '')
    .match(/.{2}/g)
    ?.map((hex) => parseInt(hex, 16));
  return `rgba(${numArray?.join(',')}, ${fade})`;
}

function removeRoot(label: string) {
  return label.split(/, (\[|<)/)[0];
}

const isFullScreen = useFullScreen();
</script>

<template>
  <!-- the only way to make this overlay behave the way i want it to is to use a v-card here -->
  <v-card color="transparent" width="100%" height="100%">
    <v-overlay
      absolute
      class="overlay"
      opacity=".2"
      :value="!nodeCount || isLoading || !selectedAuthors.length"
    >
      <h1 v-if="isLoading" class="no-nodes">
        <v-progress-circular indeterminate color="#0f1226" />
      </h1>
      <h1 v-if="!isLoading" class="no-nodes">Select two or more authors!</h1>
    </v-overlay>

    <visualization
      id="visId"
      :graph="weightedGraph"
      :on-node-click="nodeClick"
      :on-node-drag-end="nodeDragEnd"
      :node-canvas-object="nodeObject"
      :node-pointer-area-paint="areaPaint"
      :node-canvas-object-mode="() => 'replace'"
      :height="isFullScreen ? undefined : 500"
      :zoom-to-fit="zoomToFit"
      :link-directional-arrow-length="1.3"
      :refresh="renderKey"
      :auto-pause-redraw="false"
      :node-rel-size="4"
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
            <v-icon>mdi-image</v-icon>
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
            <v-icon>mdi-text-box</v-icon>
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
          <v-icon v-if="fab.control">mdi-close</v-icon>
          <v-icon v-else>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-tooltip right transition="slide-x-transition">
        <template #activator="{ on, attrs }">
          <v-btn fab small v-bind="attrs" @click.stop="paused = !paused" v-on="on">
            <v-icon v-if="!paused">mdi-pause</v-icon>
            <v-icon v-else>mdi-play</v-icon>
          </v-btn>
        </template>
        <span>{{ paused ? 'Unp' : 'P' /** hehehehe */ }}ause Simulation</span>
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
            :color="nodeColors[key]"
            :label="nodeTypeLabels[key].other"
            dense
            hide-details
          />
        </v-list-item>
      </v-list>
    </div>
  </v-card>
</template>

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

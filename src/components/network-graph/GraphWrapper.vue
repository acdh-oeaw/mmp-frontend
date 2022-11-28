<script lang="ts" setup>
import type { CanvasCustomRenderFn, CanvasPointerAreaPaintFn, NodeObject } from 'force-graph';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

import { type GetKeywordGraph, useKeywordGraph } from '@/api';
import FullscreenButton from '@/components/FullscreenButton.vue';
import Visualization from '@/components/network-graph/network-graph.vue';
import { isNonEmptyArray } from '@/lib/is-nonempty-array';
import { isNotNullable } from '@/lib/is-not-nullable';
import { nodeColors } from '@/lib/network-graph/network-graph.config';
import type { GraphData } from '@/lib/network-graph/network-graph.types';
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
const typefilters = ref({
  Region: true,
  Ethnonym: true,
  Keyword: true,
  Name: true,
});
const renderKey = ref(0);
const zoomToFit = ref(true);

const keywordGraphQuey = useKeywordGraph(
  computed(() => {
    // FIXME:
    if (Object.values(props).some(isNotNullable)) {
      const searchParams: GetKeywordGraph.SearchParams = {
        ids: props.passage?.toString().split('+').join(','),
        text__autor_and: props.author,
        key_word_and: props.keyword,
        use_case: props.usecase,
        ort: props.place,
      };

      return searchParams;
    }

    function getDateFilters() {
      const [start, end] = Array.isArray(searchFilters.value['date-range'])
        ? searchFilters.value['date-range']
        : [searchFilters.value['date-range'] - 5, searchFilters.value['date-range'] + 4];

      const dateFilters: GetKeywordGraph.SearchParams =
        searchFilters.value['date-filter'] === 'content'
          ? {
              rvn_stelle_key_word_keyword__start_date: start,
              rvn_stelle_key_word_keyword__start_date_lookup: 'gt',
              rvn_stelle_key_word_keyword__end_date: end,
              rvn_stelle_key_word_keyword__end_date_lookup: 'lt',
            }
          : {
              rvn_stelle_key_word_keyword__text__not_before: start,
              rvn_stelle_key_word_keyword__text__not_before_lookup: 'gt',
              rvn_stelle_key_word_keyword__text__not_after: end,
              rvn_stelle_key_word_keyword__text__not_after_lookup: 'lt',
            };

      return dateFilters;
    }

    const searchParams: GetKeywordGraph.SearchParams = {
      ids: isNonEmptyArray(searchFilters.value['passage'])
        ? searchFilters.value['passage'].join(',')
        : undefined,
      has_usecase: searchFilters.value['dataset'] === 'case-studies',
      [searchFilters.value['query-mode'] === 'intersection' ? 'text__autor_and' : 'text__autor']:
        searchFilters.value['author'],
      [searchFilters.value['query-mode'] === 'intersection' ? 'key_word_and' : 'key_word']:
        searchFilters.value['keyword'],
      ort: searchFilters.value['place'],
      use_case: searchFilters.value['case-study'],
      ...getDateFilters(),
      // TODO: art:
    };

    return searchParams;
  })
);

const isLoading = computed(() => keywordGraphQuey.isInitialLoading.value);

const graph = computed<GraphData>(() => {
  const graph: GraphData = { edges: [], nodes: [] };

  if (keywordGraphQuey.data.value == null) return graph;

  return keywordGraphQuey.data.value.map();
});

const nodeCount = computed(() => {
  return graph.value.nodes.length;
});

const weightedGraph = computed(() => {
  const ret = JSON.parse(JSON.stringify(graph.value));

  const blacklist: Array<any> = [];

  // filter by connection to selected keyword
  if (route.params.id) {
    const neighborNodes = route.params.id.split('+').map((nodeId) => `archiv__keyword__${nodeId}`);

    if (neighborNodes.length && route.query.showNeighborsOnly) {
      ret.nodes = ret.nodes.filter((node) => {
        if (
          ret.edges.filter(
            (edge) =>
              (edge.source === node.id || edge.target === node.id) &&
              (neighborNodes.includes(edge.source) || neighborNodes.includes(edge.target))
          ).length
        ) {
          return true;
        }

        blacklist.push(node.id);
        return false;
      });
    }
  }

  // filter types
  ret.nodes = ret.nodes.filter((node) => {
    if (typefilters.value[node.keyword_type]) return true;
    blacklist.push(node.id);
    return false;
  });

  ret.edges = ret.edges.filter(
    (edge) => !blacklist.includes(edge.target.id) && !blacklist.includes(edge.source.id)
  );

  // assign weight
  ret.edges.forEach((edge) => {
    const targetNode = ret.nodes.filter((node) => node.id === edge.source.id)[0];
    edge.color = lightenColor(nodeColors[targetNode?.keyword_type], 0.3) || '#D5D5D5';

    if (targetNode?.targets) targetNode.targets += 1;
    else if (targetNode) targetNode.targets = 2;
  });

  ret.nodes = ret.nodes.map((node) => {
    const retNode = node;
    retNode.color = nodeColors[node.keyword_type];
    return retNode;
  });

  return ret;
});

const types = computed(() => {
  return unique(graph.value.nodes.map((node) => node.keyword_type));
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
  link.href = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(weightedGraph.value)
  )}`;
  link.click();
  link.remove();
}

function getCsvData() {
  let csvContent = 'ID,Keyword,Type,Sources,Targets\n';

  const toCsv = weightedGraph.value.nodes.map((node) => {
    const csvObj = {
      ID: node.id.replace(/\D/g, ''),
      Keyword: node.label.replace(',', ''),
      Type: node.keyword_type,
      Sources: [],
      Targets: [],
    };

    weightedGraph.value.edges.forEach((edge) => {
      if (edge.source.id === node.id) csvObj.Targets.push(removeRoot(edge.target.label));
      else if (edge.target.id === node.id) csvObj.Sources.push(removeRoot(edge.source.label));
    });

    csvObj.Targets = csvObj.Targets.join('/');
    csvObj.Sources = csvObj.Sources.join('/');

    return csvObj;
  });

  toCsv.forEach((node: any) => {
    csvContent += `${Object.values(node).join(',')}\n`;
  });

  const link = document.createElement('a');
  link.download = 'graph.csv';
  link.href = `data:text/csv;charset=utf-8,${csvContent}`;
  link.click();
  link.remove();
}

function getTextData() {
  const list = weightedGraph.value.nodes;
  const ret: any = {};

  list.forEach((node: any) => {
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

  const fontSize = ((Math.log2(node.targets) || 1) + 18) / globalScale;
  ctx.font = `${fontSize}px 'Roboto FlexVariable', system-ui, sans-serif`;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const typeColor = nodeColors[node.keyword_type] || 'grey';

  if (route.params.id?.toString(10).split('+').includes(node.id.replace(/\D/g, ''))) {
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

  // FIXME:
  // code for implementing multiple selected nodes
  let q = route.params.id;
  const id = node.id.replace(/[^0-9]/g, '');
  // add or remove specific node from query
  if (q && !props.usecase) {
    q = q.split('+');
    if (q.includes(id)) q = q.filter((x) => x !== id);
    else q.push(id);
    q = q.join('+');
  } else {
    q = id;
  }

  if (q) {
    router.push({
      name: isFullScreen.value ? 'Keyword Detail Fullscreen' : 'Keyword Detail',
      params: { id: q },
      query: props.usecase
        ? createSearchFilterParams({ ...searchFilters.value, 'case-study': [props.usecase] })
        : route.query,
    });
  } else {
    router.push({
      name: isFullScreen.value ? 'Network Graph Fullscreen' : 'Network Graph',
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
    <v-overlay absolute class="overlay" opacity=".2" :value="!nodeCount || isLoading">
      <h1 v-if="!isLoading" class="no-nodes">No nodes found!</h1>
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
      :height="isFullScreen ? undefined : 500"
      :zoom-to-fit="zoomToFit"
      :link-directional-particles="1"
      :link-directional-particle-width="1.7"
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
        <v-list-item v-for="key in types" :key="key" dense style="min-height: unset">
          <v-checkbox
            v-model="typefilters[key]"
            :color="nodeColors[key]"
            :label="key"
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

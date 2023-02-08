<script lang="ts" setup>
import { forceLink } from 'd3';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router/composables';

import { useKeywordByAuthorGraph } from '@/api';
import FullscreenButton from '@/components/fullscreen-button.vue';
import Visualization from '@/components/network-graph.vue';
import { useNetworkGraphStore } from '@/lib/network-graph/use-network-graph-store';
import { useDetailsSearchFilters } from '@/lib/search/use-details-search-filters';
import { useNetworkGraphSearchParams } from '@/lib/search/use-network-graph-search-params';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { unique } from '@/lib/unique';

const router = useRouter();
const store = useNetworkGraphStore();

const colors = {
	Keyword: '#039be5', // blue darken-1
	Ethnonym: '#00897b', // teal darken-1
	Name: '#ffb300', // amber darken-1
	Region: '#43a047', // green darken-1
	author: '#ff5858', // red
	Unsicher: '#808080', // grey
};

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
	author: true,
});
const renderKey = ref(0);
const zoomToFit = ref(true);

const searchParams = useNetworkGraphSearchParams();
const { searchFilters, createSearchFilterParams } = useSearchFilters();
const {
	searchFilters: detailSearchFilters,
	createSearchFilterParams: createDetailSearchFilterParams,
} = useDetailsSearchFilters();
const graphQuery = useKeywordByAuthorGraph(searchParams);
const graph = computed(() => graphQuery.data.value ?? { nodes: [], edges: [] });
const isFetching = computed(() => graphQuery.isFetching.value);

const nodeCount = computed(() => {
	return graph.value?.nodes?.length;
});

const types = computed(() => {
	const ret = graph.value?.nodes?.map((x) => x.type || x.kind);
	return unique(ret ?? []);
});

const weightedGraph = computed(() => {
	// This is a tricky one. Usually, as this function gets calld, all edges have already been converted so that their targets and sources are object. If you refresh or follow a direct link, this doesnt happen. So I wrote this code expecting both cases.
	if (graph.value == null) return { nodes: [], edges: [] };

	const ret = { ...graph.value };
	const blacklist: any[] = [];

	// filter by connection to selected keyword
	if (detailSearchFilters.value['detail-kind']) {
		let neighborNodes: any[] = [];

		if (detailSearchFilters.value['detail-kind'] === 'keyword') {
			neighborNodes = detailSearchFilters.value['detail-id'].map((id) => {
				return `keyword_${id}`;
			});
		} else if (detailSearchFilters.value['detail-kind'] === 'author') {
			neighborNodes = detailSearchFilters.value['detail-id'].map((id) => {
				return `autor_${id}`;
			});
		}

		if (neighborNodes.length && store.showNeighborsOnly) {
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
				) {
					return true;
				}

				blacklist.push(node.key);

				return false;
			});
		}
	}

	// filter types
	ret.nodes = ret.nodes.filter((node) => {
		if (typefilters.value[node.type] || typefilters.value[node.kind]) return true;
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
		edge.color = lightenColor(colors[targetNode?.type], 0.3 ** edge.count) || '#d5d5d5';

		if (targetNode?.targets) targetNode.targets += edge.count || 1;
		else if (targetNode) targetNode.targets = edge.count || 1;
	});

	// color nodes
	ret.nodes = ret.nodes.map((node) => {
		const retNode = node;
		retNode.color = colors[node.type] || colors[node.kind];
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
});

function getCanvasData() {
	const link = document.createElement('a');
	link.download = 'graph.png';
	link.href = document.getElementById('visId')?.getElementsByTagName('canvas')?.[0]?.toDataURL();
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

function removeRoot(label: string) {
	return label.split(/, (\[|<)/)[0];
}

function getCsvData() {
	let csvContent = 'ID,Keyword,Type,Sources,Targets\r\n';
	const toCsv = weightedGraph.value.nodes.map((node) => {
		const csvObj = {
			ID: node.id,
			Keyword: node.label.replace(',', ''),
			Type: node.type,
			Sources: [],
			Targets: [],
		};
		weightedGraph.value.edges.forEach((edge) => {
			if (edge.source.key === node.key) csvObj.Targets.push(removeRoot(edge.target.label));
			else if (edge.target.key === node.key) csvObj.Sources.push(removeRoot(edge.source.label));
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
}

function getTextData() {
	const list = weightedGraph.value.nodes;
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
}

function nodeObject(node: any, ctx: any, globalScale: number) {
	ctx.beginPath();
	const label = node.label;

	const fontSize = ((Math.log2(node.targets) || 1) + 18) / globalScale;
	ctx.font = `${fontSize}px 'Roboto FlexVariable', ui-sans-serif, system-ui, sans-serif`;

	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	if (
		(node.kind === 'author' &&
			detailSearchFilters.value['detail-kind'] === 'author' &&
			detailSearchFilters.value['detail-id'].includes(node.id)) ||
		(node.kind !== 'author' &&
			detailSearchFilters.value['detail-kind'] === 'keyword' &&
			detailSearchFilters.value['detail-id'].includes(node.id))
	) {
		ctx.shadowColor = node.color;
		ctx.shadowBlur = 15;
		ctx.fillStyle = '#f1f5fa';
		ctx.strokeStyle = node.color;
		ctx.lineWidth = 2 / globalScale;
	} else {
		ctx.fillStyle = node.color;
		ctx.strokeStyle = '#f1f5fa';
		ctx.lineWidth = 1.7 / globalScale;
	}

	ctx.strokeText(label, node.x, node.y);
	ctx.fillText(label, node.x, node.y);

	ctx.shadowBlur = 0;

	node.area = [ctx.measureText(label).width, fontSize].map((n) => n + fontSize * 0.2); // for areapaint
}

function areaPaint(node: any, color: any, ctx: any) {
	ctx.fillStyle = color;
	const bckgDimensions = node.area;
	return (
		bckgDimensions &&
		ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions)
	);
}

function nodeClick(node: any) {
	const detailPanelIds = detailSearchFilters.value['detail-id'];
	const detailPanelKind = detailSearchFilters.value['detail-kind'];

	if (node.kind === 'author') {
		if (detailPanelKind === 'author' && detailPanelIds.includes(node.id)) {
			router.push({
				query: {
					...createSearchFilterParams(searchFilters.value),
					...createDetailSearchFilterParams({
						'detail-kind': 'author',
						'detail-id': detailPanelIds.filter((id) => id !== node.id),
					}),
				},
			});
		} else {
			router.push({
				query: {
					...createSearchFilterParams(searchFilters.value),
					...createDetailSearchFilterParams({
						'detail-kind': 'author',
						'detail-id': detailPanelIds.concat(node.id),
					}),
				},
			});
		}
	}

	if (detailPanelKind === 'keyword' && detailPanelIds.includes(node.id)) {
		router.push({
			query: {
				...createSearchFilterParams(searchFilters.value),
				...createDetailSearchFilterParams({
					'detail-kind': 'keyword',
					'detail-id': detailPanelIds.filter((id) => id !== node.id),
				}),
			},
		});
	} else {
		router.push({
			query: {
				...createSearchFilterParams(searchFilters.value),
				...createDetailSearchFilterParams({
					'detail-kind': 'keyword',
					'detail-id': detailPanelIds.concat(node.id),
				}),
			},
		});
	}
}

function nodeDragEnd(node: any) {
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
	if (searchFilters.value.author.length) {
		return forceLink().strength((link) => (link.source.kind === 'author' ? 0.7 : 0));
	}
	return forceLink();
}

function lightenColor(color: string | null, fade: number) {
	if (!color) return color;

	const numArray = color
		.replace('#', '')
		.match(/.{2}/g)
		?.map((hex) => parseInt(hex, 16));

	if (numArray == null) return null;

	return `rgba(${numArray.join()}, ${fade})`;
}
</script>

<template>
	<!-- the only way to make this overlay behave the way i want it to is to use a v-card here -->
	<VCard color="transparent" width="100%" height="100%">
		<VOverlay absolute class="overlay" opacity=".2" :value="!nodeCount || isFetching">
			<h1 v-if="!isFetching" class="no-nodes">No nodes found!</h1>
			<h1 v-else class="no-nodes">
				<VProgressCircular indeterminate color="#0F1226" />
			</h1>
		</VOverlay>

		<Visualization
			id="visId"
			:graph="weightedGraph"
			:on-node-click="nodeClick"
			:on-node-drag-end="nodeDragEnd"
			:node-canvas-object="nodeObject"
			:node-pointer-area-paint="areaPaint"
			:node-canvas-object-mode="() => 'replace'"
			:height="500"
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

		<RouterView />

		<VSpeedDial
			v-model="fab.download"
			absolute
			top
			right
			direction="bottom"
			transition="slide-y-transition"
		>
			<template #activator>
				<VBtn v-model="fab.download" icon small>
					<VIcon v-if="fab.download"> mdi-close </VIcon>
					<VIcon v-else> mdi-tray-arrow-down </VIcon>
				</VBtn>
			</template>
			<VTooltip left transition="slide-x-reverse-transition">
				<template #activator="{ on, attrs }">
					<VBtn fab small v-bind="attrs" @click="getCanvasData" v-on="on">
						<VIcon>mdi-image-outline</VIcon>
					</VBtn>
				</template>
				<span>Download canvas as .png</span>
			</VTooltip>
			<VTooltip left transition="slide-x-reverse-transition">
				<template #activator="{ on, attrs }">
					<VBtn fab small v-bind="attrs" @click="getJsonData" v-on="on">
						<VIcon>mdi-code-json</VIcon>
					</VBtn>
				</template>
				<span>Download node data as .json</span>
			</VTooltip>
			<VTooltip left transition="slide-x-reverse-transition">
				<template #activator="{ on, attrs }">
					<VBtn fab small v-bind="attrs" @click="getTextData" v-on="on">
						<VIcon>mdi-text-box-outline</VIcon>
					</VBtn>
				</template>
				<span>Download node data as .txt</span>
			</VTooltip>
			<VTooltip left transition="slide-x-reverse-transition">
				<template #activator="{ on, attrs }">
					<VBtn fab small v-bind="attrs" @click="getCsvData" v-on="on">
						<VIcon>mdi-file-delimited-outline</VIcon>
					</VBtn>
				</template>
				<span>Download node data as .csv</span>
			</VTooltip>
		</VSpeedDial>

		<FullscreenButton />

		<VSpeedDial
			v-model="fab.control"
			absolute
			top
			left
			direction="bottom"
			transition="slide-y-transition"
		>
			<template #activator>
				<VBtn v-model="fab.control" icon small>
					<VIcon v-if="fab.control"> mdi-close </VIcon>
					<VIcon v-else> mdi-dots-vertical </VIcon>
				</VBtn>
			</template>
			<VTooltip right transition="slide-x-transition">
				<template #activator="{ on, attrs }">
					<VBtn fab small v-bind="attrs" @click.stop="paused = !paused" v-on="on">
						<VIcon v-if="!paused">mdi-pause</VIcon>
						<VIcon v-else>mdi-play</VIcon>
					</VBtn>
				</template>
				<span>{{ paused ? 'Unp' : 'P' }}ause Simulation</span>
			</VTooltip>
			<VTooltip right transition="slide-x-transition">
				<template #activator="{ on, attrs }">
					<VBtn fab small v-bind="attrs" @click.stop="zoomToFit = !zoomToFit" v-on="on">
						<VIcon>mdi-fit-to-screen-outline</VIcon>
					</VBtn>
				</template>
				<span>Fit Nodes to Screen</span>
			</VTooltip>
			<VTooltip right transition="slide-x-transition">
				<template #activator="{ on, attrs }">
					<VBtn fab small v-bind="attrs" @click.stop="refresh" v-on="on">
						<VIcon>mdi-pin-off</VIcon>
					</VBtn>
				</template>
				<span>Unpin all nodes</span>
			</VTooltip>
		</VSpeedDial>
		<div absolute bottom left class="legend">
			<VList dense color="transparent">
				<VListItem v-for="key in types" :key="key" dense style="min-height: unset">
					<VCheckbox
						v-model="typefilters[key]"
						:color="colors[key]"
						:label="key.charAt(0).toUpperCase() + key.slice(1)"
						dense
						hide-details
					/>
				</VListItem>
			</VList>
		</div>
	</VCard>
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

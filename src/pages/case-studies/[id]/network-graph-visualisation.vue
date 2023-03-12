<script lang="ts" setup>
import { type ForceGraphInstance } from "force-graph";
import { computed, ref } from "vue";

import { type KeywordType, type ResourceKind } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NetworkGraph from "@/components/network-graph.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import OverlayPanel from "@/components/overlay-panel.vue";
import OverlayPanelButton from "@/components/overlay-panel-button.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import { useCaseStudyIdParam } from "@/lib/case-studies/use-case-study-id-param";
import { saveAsCsv, saveAsGexf, saveAsImage } from "@/lib/network-graph/export-data";
import { keywordNodeColors, nodeColors } from "@/lib/network-graph/network-graph.config";
import {
	type NetworkGraphContext,
	type NetworkGraphData,
	type NetworkGraphNode,
} from "@/lib/network-graph/network-graph.types";
import { useNetworkGraph } from "@/lib/network-graph/use-network-graph";
import { keywordTypeLabels, kindLabels } from "@/lib/search/search.config";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { ClientOnly } from "#components";
import { useHead, useRouter } from "#imports";

const title = "Network-graph visualisation";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const _id = useCaseStudyIdParam();

const { createSearchFilterParams, searchFilters } = useSearchFilters();
const { graph, isEmpty, isError, isFetching, isLoading } = useNetworkGraph(searchFilters);

//

const router = useRouter();
const { createSelectionParams, selection } = useSelection();
const selectedKeys = computed<Set<NetworkGraphNode["key"]>>(() => {
	return new Set(selection.value.selection);
});

function onNodeClick(node: NetworkGraphNode | null) {
	if (node == null) return;

	const _selection = new Set(selectedKeys.value);
	if (_selection.has(node.key)) {
		_selection.delete(node.key);
	} else {
		_selection.add(node.key);
	}

	router.push({
		query: {
			...createSearchFilterParams(searchFilters.value),
			...createSelectionParams({ selection: Array.from(_selection) }),
		},
	});
}

//

const highlightedKeys = ref(new Set<NetworkGraphNode["key"]>());

function onNodeHover(_node: NetworkGraphNode | null) {
	//
}

//

const resourceKindFilters = ref(
	new Map<ResourceKind, boolean>([
		["autor", true],
		["keyword", true],
	]),
);

function onToggleResourceKindFilter(value: ResourceKind, event: Event) {
	const element = event.currentTarget as HTMLInputElement;
	const isVisible = element.checked;
	resourceKindFilters.value.set(value, isVisible);
}

const keywordTypeFilters = ref(
	new Map<KeywordType, boolean>([
		["Ethnonym", true],
		["Keyword", true],
		["Name", true],
		["Region", true],
	]),
);

function onToggleKeywordTypeFilter(value: KeywordType, event: Event) {
	const element = event.currentTarget as HTMLInputElement;
	const isVisible = element.checked;
	keywordTypeFilters.value.set(value, isVisible);
}

// TODO: toggle `nodeVisibility` instead?
/** Filter by selected node types. */
const filteredGraph = computed<NetworkGraphData>(() => {
	const nodes: NetworkGraphData["nodes"] = new Map();
	const edges: NetworkGraphData["edges"] = new Map();

	graph.value.nodes.forEach((node) => {
		if (resourceKindFilters.value.get(node.kind) === true) {
			if (node.kind === "keyword") {
				if (keywordTypeFilters.value.get(node.type) === true) {
					nodes.set(node.key, node);
				}
			} else {
				nodes.set(node.key, node);
			}
		}
	});

	graph.value.edges.forEach((edge) => {
		// FIXME: there must be a better way
		/** `d3-force` replaces string ids with object references on init. */
		// @ts-expect-error Mutated by `d3`.
		const source = typeof edge.source === "string" ? edge.source : edge.source.key;
		// @ts-expect-error Mutated by `d3`.
		const target = typeof edge.target === "string" ? edge.target : edge.target.key;
		if (nodes.has(source) && nodes.has(target)) {
			edges.set(edge.key, edge);
		}
	});

	return { nodes, edges };
});

//

const context = ref<NetworkGraphContext>({
	graph: null,
});

function onReady(instance: ForceGraphInstance) {
	context.value.graph = instance;
}

//

function onZoomToFit() {
	context.value.graph?.zoomToFit(150);
}

function onUnPinNodes() {
	context.value.graph?.graphData().nodes.forEach((node) => {
		node.fx = undefined;
		node.fy = undefined;
	});
	context.value.graph?.d3ReheatSimulation();
}

function onClearSelection() {
	router.push({ query: createSearchFilterParams(searchFilters.value) });
}

//

function onSaveAsImage() {
	// UPSTREAM:
	// saveAsImage(context.value.graph?.getContainer());
	const container = document.querySelector("[data-network-graph]");
	if (container != null) {
		saveAsImage(container as HTMLElement);
	}
}

function onSaveAsCsv() {
	saveAsCsv(filteredGraph.value);
}

function onSaveAsGexf() {
	saveAsGexf(filteredGraph.value);
}
</script>

<template>
	<div class="relative mx-auto h-full w-full py-4">
		<h2 class="sr-only">Network-graph visualisation</h2>

		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading network graph...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load network graph.</ErrorMessage>
			</Centered>
		</template>

		<template v-else-if="isEmpty">
			<Centered>
				<NothingFoundMessage></NothingFoundMessage>
			</Centered>
		</template>

		<template v-else>
			<ClientOnly>
				<template #fallback>
					<Centered>
						<LoadingIndicator>Loading network visualisation...</LoadingIndicator>
					</Centered>
				</template>

				<template v-if="isFetching">
					<Centered class="z-10">
						<LoadingIndicator>Updating network graph...</LoadingIndicator>
					</Centered>
				</template>

				<VisualisationContainer
					v-slot="{ width, height }"
					class="min-h-[800px] rounded transition-all"
					:class="{ 'opacity-50 grayscale': isFetching }"
				>
					<NetworkGraph
						:graph="filteredGraph"
						:height="height"
						:highlighted-keys="highlightedKeys"
						:selected-keys="selectedKeys"
						:width="width"
						@node-click="onNodeClick"
						@node-hover="onNodeHover"
						@ready="onReady"
					>
						<OverlayPanel position="top left">
							<OverlayPanelButton @click="onZoomToFit">Zoom to fit</OverlayPanelButton>
							<OverlayPanelButton @click="onUnPinNodes">Unpin nodes</OverlayPanelButton>
							<OverlayPanelButton @click="onClearSelection">Clear selection</OverlayPanelButton>
						</OverlayPanel>
						<OverlayPanel position="bottom left">
							<form class="flex items-center gap-2 text-xs font-medium" @submit.prevent="">
								<template v-for="[key, isVisible] of resourceKindFilters">
									<label v-if="key !== 'keyword'" :key="key" class="flex items-center gap-1">
										<input
											:checked="isVisible"
											type="checkbox"
											:value="key"
											@change="
												(event) => {
													onToggleResourceKindFilter(key, event);
												}
											"
										/>
										<span class="h-3 w-3 rounded" :style="{ background: nodeColors[key] }" />
										<span>{{ kindLabels[key].other }}</span>
									</label>
								</template>
								<!-- TODO: should be a checkbox group -->
								<label
									v-for="[key, isVisible] of keywordTypeFilters"
									:key="key"
									class="flex items-center gap-1"
								>
									<input
										:checked="isVisible"
										type="checkbox"
										:value="key"
										@change="
											(event) => {
												onToggleKeywordTypeFilter(key, event);
											}
										"
									/>
									<span class="h-3 w-3 rounded" :style="{ background: keywordNodeColors[key] }" />
									<span>{{ keywordTypeLabels[key].other }}</span>
								</label>
							</form>
						</OverlayPanel>
						<OverlayPanel position="bottom right">
							<OverlayPanelButton label="Save as image" @click="onSaveAsImage">
								Save as image
							</OverlayPanelButton>
							<OverlayPanelButton label="Save as csv" @click="onSaveAsCsv">
								Save as csv
							</OverlayPanelButton>
							<OverlayPanelButton label="Save as gexf" @click="onSaveAsGexf">
								Save as gexf
							</OverlayPanelButton>
						</OverlayPanel>
					</NetworkGraph>
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>

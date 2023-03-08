<script lang="ts" setup>
import {
	FolderArrowDownIcon,
	MagnifyingGlassMinusIcon,
	MagnifyingGlassPlusIcon,
} from "@heroicons/vue/24/outline";
import { inject } from "vue";

import { type KeywordType, type ResourceKind } from "@/api";
import Toolbar from "@/components/toolbar.vue";
import ToolbarIconButton from "@/components/toolbar-icon-button.vue";
import { saveAsCsv, saveAsGexf, saveAsImage } from "@/lib/network-graph/export-data";
import { keywordNodeColors, nodeColors } from "@/lib/network-graph/network-graph.config";
import { key } from "@/lib/network-graph/network-graph.context";
import { type NetworkGraphData } from "@/lib/network-graph/network-graph.types";
import { keywordTypeLabels, kindLabels } from "@/lib/search/search.config";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useRouter } from "#imports";

const props = defineProps<{
	graph: NetworkGraphData;
	keywordTypeFilters: Map<KeywordType, boolean>;
	resourceKindFilters: Map<ResourceKind, boolean>;
}>();

const emit = defineEmits<{
	(event: "toggle-keyword-type-filter", filter: KeywordType, isVisible: boolean): void;
	(event: "toggle-resource-kind-filter", filter: ResourceKind, isVisible: boolean): void;
}>();

const context = inject(key);

const router = useRouter();
const { createSearchFilterParams, searchFilters } = useSearchFilters();

//

function onToggleKeywordTypeFilter(filter: KeywordType, event: Event) {
	const element = event.currentTarget as HTMLInputElement;
	const isVisible = element.checked;
	emit("toggle-keyword-type-filter", filter, isVisible);
}

function onToggleResourceKindFilter(filter: ResourceKind, event: Event) {
	const element = event.currentTarget as HTMLInputElement;
	const isVisible = element.checked;
	emit("toggle-resource-kind-filter", filter, isVisible);
}

//

function onZoomIn() {
	if (context?.graph == null) return;
	const current = context.graph.zoom();
	context.graph.zoom(current + 0.5, 150);
}

function onZoomOut() {
	if (context?.graph == null) return;
	const current = context.graph.zoom();
	context.graph.zoom(current - 0.5, 150);
}

function onZoomToFit() {
	if (context?.graph == null) return;
	context.graph.zoomToFit(150);
}

function onUnPinNodes() {
	if (context?.graph == null) return;
	context.graph.graphData().nodes.forEach((node) => {
		node.fx = undefined;
		node.fy = undefined;
	});
	context.graph.d3ReheatSimulation();
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
	saveAsCsv(props.graph);
}

function onSaveAsGexf() {
	saveAsGexf(props.graph);
}
</script>

<template>
	<Toolbar>
		<div class="flex items-center gap-2">
			<ToolbarIconButton label="Zoom in" @click="onZoomIn">
				<MagnifyingGlassPlusIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton label="Zoom out" @click="onZoomOut">
				<MagnifyingGlassMinusIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton label="Zoom to fit" @click="onZoomToFit">
				<MagnifyingGlassMinusIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton label="Unpin nodes" @click="onUnPinNodes">
				<MagnifyingGlassMinusIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton label="Clear selection" @click="onClearSelection">
				<MagnifyingGlassMinusIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
		</div>
		<div class="flex items-center gap-2">
			<form class="flex items-center gap-2 text-xs font-medium" @submit.prevent="">
				<template v-for="[key, isVisible] of props.resourceKindFilters">
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
					v-for="[key, isVisible] of props.keywordTypeFilters"
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
		</div>
		<div class="flex items-center gap-2">
			<ToolbarIconButton label="Save as image" @click="onSaveAsImage">
				<FolderArrowDownIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton label="Save as csv" @click="onSaveAsCsv">
				<FolderArrowDownIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton label="Save as gexf" @click="onSaveAsGexf">
				<FolderArrowDownIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
		</div>
	</Toolbar>
</template>

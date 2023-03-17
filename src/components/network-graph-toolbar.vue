<script lang="ts" setup>
import {
	ArrowsPointingInIcon,
	ArrowsPointingOutIcon,
	FolderArrowDownIcon,
	MagnifyingGlassMinusIcon,
	MagnifyingGlassPlusIcon,
	XMarkIcon,
} from "@heroicons/vue/24/outline";
import { inject } from "vue";

import Toolbar from "@/components/toolbar.vue";
import ToolbarIconButton from "@/components/toolbar-icon-button.vue";
import { saveAsCsv, saveAsGexf, saveAsImage } from "@/lib/network-graph/export-data";
import { key } from "@/lib/network-graph/network-graph.context";
import { type NetworkGraphData } from "@/lib/network-graph/network-graph.types";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useRouter } from "#imports";

const props = defineProps<{
	graph: NetworkGraphData;
}>();

const context = inject(key);

const router = useRouter();
const { createSearchFilterParams, searchFilters } = useSearchFilters();

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
			<ToolbarIconButton label="Unpin nodes" @click="onUnPinNodes">
				<ArrowsPointingOutIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton label="Clear selection" @click="onClearSelection">
				<XMarkIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
		</div>
		<div class="mx-auto flex items-center gap-2">
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
		<div class="flex items-center gap-2">
			<ToolbarIconButton label="Zoom in" @click="onZoomIn">
				<MagnifyingGlassPlusIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton label="Zoom out" @click="onZoomOut">
				<MagnifyingGlassMinusIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton label="Zoom to fit" @click="onZoomToFit">
				<ArrowsPointingInIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
		</div>
	</Toolbar>
</template>

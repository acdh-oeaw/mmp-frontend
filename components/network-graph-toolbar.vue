<script lang="ts" setup>
import {
	FolderArrowDownIcon,
	LockOpenIcon,
	MagnifyingGlassMinusIcon,
	MagnifyingGlassPlusIcon,
	ViewfinderCircleIcon,
	XMarkIcon,
} from "@heroicons/vue/24/outline";
import { inject } from "vue";

import FullscreenButton from "@/components/fullscreen-button.vue";
import Toolbar from "@/components/toolbar.vue";
import ToolbarIconButton from "@/components/toolbar-icon-button.vue";
import { saveAsCsv, saveAsGexf, saveAsImage } from "@/lib/network-graph/export-data";
import { key } from "@/lib/network-graph/network-graph.context";
import type { NetworkGraphData } from "@/lib/network-graph/network-graph.types";
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
	void router.push({ query: createSearchFilterParams(searchFilters.value) });
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
				<LockOpenIcon class="size-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton label="Clear selection" @click="onClearSelection">
				<XMarkIcon class="size-5 shrink-0" />
			</ToolbarIconButton>
		</div>
		<div class="flex items-center gap-2">
			<ToolbarIconButton label="Save as image" @click="onSaveAsImage">
				<FolderArrowDownIcon class="size-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton label="Save as csv" @click="onSaveAsCsv">
				<FolderArrowDownIcon class="size-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton label="Save as gexf" @click="onSaveAsGexf">
				<FolderArrowDownIcon class="size-5 shrink-0" />
			</ToolbarIconButton>
		</div>
		<div class="flex items-center gap-2">
			<ToolbarIconButton label="Zoom in" @click="onZoomIn">
				<MagnifyingGlassPlusIcon class="size-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton label="Zoom out" @click="onZoomOut">
				<MagnifyingGlassMinusIcon class="size-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton label="Zoom to fit" @click="onZoomToFit">
				<ViewfinderCircleIcon class="size-5 shrink-0" />
			</ToolbarIconButton>
		</div>
		<div class="flex items-center gap-2">
			<FullscreenButton />
		</div>
	</Toolbar>
</template>

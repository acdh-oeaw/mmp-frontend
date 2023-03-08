<script lang="ts" setup>
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from "@heroicons/vue/24/outline";
import { inject } from "vue";

import IconButton from "@/components/icon-button.vue";
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

function onZoomToFit() {
	context?.graph?.zoomToFit(150);
}

function onUnPinNodes() {
	context?.graph?.graphData().nodes.forEach((node) => {
		node.fx = undefined;
		node.fy = undefined;
	});
	context?.graph?.d3ReheatSimulation();
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
	<div class="absolute inset-x-0 bg-neutral-50 shadow-lg">
		<aside class="mx-auto flex w-full max-w-7xl items-center gap-2 px-8 py-2">
			<div class="flex gap-2">
				<IconButton label="Zoom in" @click="onZoomIn">
					<MagnifyingGlassPlusIcon class="h-5 w-5 shrink-0" />
				</IconButton>
				<IconButton label="Zoom out" @click="onZoomOut">
					<MagnifyingGlassMinusIcon class="h-5 w-5 shrink-0" />
				</IconButton>
			</div>
			<div></div>
		</aside>
	</div>
</template>

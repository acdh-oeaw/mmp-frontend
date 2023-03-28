<script lang="ts" setup>
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from "@heroicons/vue/24/outline";
import { computed, inject } from "vue";

import { type GeojsonLayer } from "@/api";
import SingleSelect from "@/components/single-select.vue";
import Toolbar from "@/components/toolbar.vue";
import ToolbarIconButton from "@/components/toolbar-icon-button.vue";
import { initialViewState } from "@/lib/geo-map/geo-map.config";
import { key } from "@/lib/geo-map/geo-map.context";
import { type BaseLayer } from "@/lib/geo-map/use-geo-map-base-layer";
import { isNotNullable } from "@/lib/is-not-nullable";

interface Item {
	key: string;
	label: string;
	description?: string;
}

const props = defineProps<{
	layers: Map<GeojsonLayer["id"], GeojsonLayer>;
	baseLayer: BaseLayer;
	baseLayers: Array<Item>;
}>();

const emit = defineEmits<{
	(event: "change-base-layer", key: BaseLayer): void;
}>();

const context = inject(key);

//

const layersLabel = "Layers";

const selectedLayerKey = context
	? context.visibility.layers.value.values().next().value
	: undefined;

const layers = computed(() => {
	const layers: Array<Item> = [];

	props.layers.forEach((layer) => {
		layers.push({
			key: String(layer.id),
			label: layer.title,
			description: [layer.description, layer.attribution].filter(isNotNullable).join(" - "),
		});
	});

	return layers;
});

function onChangeLayerSelection(_selectedKey: string) {
	if (context == null) return;
	const selectedKey = Number(_selectedKey);

	const layers = context.visibility.layers.value;
	if (layers.has(selectedKey)) {
		layers.delete(selectedKey);
	} else {
		layers.add(selectedKey);
	}
}

//

const baseLayerLabel = "Layers";

function onChangeBaseLayerSelection(_selectedKey: string) {
	emit("change-base-layer", _selectedKey as BaseLayer);
}

//

function onZoomIn() {
	context?.map?.zoomIn();
}

function onZoomOut() {
	context?.map?.zoomOut();
}

function _onResetZoom() {
	context?.map?.fitBounds(initialViewState.bounds);
}

function _onFitWorld() {
	context?.map?.fitWorld();
}
</script>

<template>
	<Toolbar>
		<div class="flex items-center gap-2">
			<SingleSelect
				v-if="layers.length > 0"
				:items="layers"
				:label="layersLabel"
				name="custom-layers"
				:selected-key="selectedLayerKey"
				@change-selection="onChangeLayerSelection"
			/>
			<SingleSelect
				v-if="props.baseLayers.length > 0"
				:items="props.baseLayers"
				:label="baseLayerLabel"
				:selected-key="props.baseLayer"
				@change-selection="onChangeBaseLayerSelection"
			/>
		</div>
		<div class="mx-auto flex items-center gap-2"></div>
		<div class="flex items-center gap-2">
			<ToolbarIconButton label="Zoom in" @click="onZoomIn">
				<MagnifyingGlassPlusIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton label="Zoom out" @click="onZoomOut">
				<MagnifyingGlassMinusIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
		</div>
	</Toolbar>
</template>

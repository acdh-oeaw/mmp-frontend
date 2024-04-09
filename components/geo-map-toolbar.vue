<script lang="ts" setup>
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from "@heroicons/vue/24/outline";
import { computed, inject } from "vue";

import { type GeojsonLayer } from "@/api";
import FullscreenButton from "@/components/fullscreen-button.vue";
import MultiSelect from "@/components/multi-select.vue";
import SingleSelect from "@/components/single-select.vue";
import Toolbar from "@/components/toolbar.vue";
import ToolbarIconButton from "@/components/toolbar-icon-button.vue";
import { initialViewState } from "@/lib/geo-map/geo-map.config";
import { key } from "@/lib/geo-map/geo-map.context";
import { type BaseLayer } from "@/lib/geo-map/use-geo-map-base-layer";
import { isNonEmptyString } from "@/lib/is-nonempty-string";

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

const selectedLayerKeys = computed(() => {
	if (context == null) return [];

	return Array.from(context.visibility.layers.value).map(String);
});

const layers = computed(() => {
	const layers: Array<Item> = [];

	props.layers.forEach((layer) => {
		layers.push({
			key: String(layer.id),
			label: layer.title,
			description: [layer.description, layer.attribution].filter(isNonEmptyString).join(" - "),
		});
	});

	return layers;
});

function onChangeLayerSelection(_selectedKeys: Array<string>) {
	if (context == null) return;
	const selectedKeys = _selectedKeys.map(Number);
	context.visibility.layers.value = new Set(selectedKeys);
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
			<MultiSelect
				v-if="layers.length > 0"
				:items="layers"
				:label="layersLabel"
				name="geojson-layers"
				:selected-keys="selectedLayerKeys"
				@change-selection="onChangeLayerSelection"
			>
				<template #selection="{ selectedKeys }">
					<span v-if="selectedKeys.length === 0">No layer selected</span>
					<span v-else-if="selectedKeys.length === 1">One layer selected</span>
					<span v-else>{{ selectedKeys.length }} layers selected</span>
				</template>
			</MultiSelect>
			<SingleSelect
				v-if="props.baseLayers.length > 0"
				:items="props.baseLayers"
				:label="baseLayerLabel"
				name="base-layer"
				:selected-key="props.baseLayer"
				@change-selection="onChangeBaseLayerSelection"
			/>
		</div>
		<div class="flex items-center gap-2">
			<ToolbarIconButton label="Zoom in" @click="onZoomIn">
				<MagnifyingGlassPlusIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
			<ToolbarIconButton label="Zoom out" @click="onZoomOut">
				<MagnifyingGlassMinusIcon class="h-5 w-5 shrink-0" />
			</ToolbarIconButton>
		</div>
		<div class="flex items-center gap-2">
			<FullscreenButton />
		</div>
	</Toolbar>
</template>

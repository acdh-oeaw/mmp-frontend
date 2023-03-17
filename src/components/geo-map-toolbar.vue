<script lang="ts" setup>
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from "@heroicons/vue/24/outline";
import { computed, inject } from "vue";

import { type GeojsonLayer } from "@/api";
import SingleSelect from "@/components/single-select.vue";
import Toolbar from "@/components/toolbar.vue";
import ToolbarIconButton from "@/components/toolbar-icon-button.vue";
import { initialViewState } from "@/lib/geo-map/geo-map.config";
import { key } from "@/lib/geo-map/geo-map.context";
import { isNotNullable } from "@/lib/is-not-nullable";

interface Item {
	key: string;
	label: string;
	description?: string;
}

const props = defineProps<{
	layers: Map<GeojsonLayer["id"], GeojsonLayer>;
}>();

const context = inject(key);

const label = "Layers";

const selectedKey = context ? context.visibility.layers.value.values().next().value : undefined;

const items = computed(() => {
	const items: Array<Item> = [];

	props.layers.forEach((layer) => {
		items.push({
			key: String(layer.id),
			label: layer.title,
			description: [layer.description, layer.attribution].filter(isNotNullable).join(" - "),
		});
	});

	return items;
});

function onChangeSelection(_selectedKey: string) {
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
		<div class="flex items-center gap-2"></div>
		<div class="mx-auto flex items-center gap-2">
			<SingleSelect
				v-if="items.length > 0"
				:items="items"
				:label="label"
				name="custom-layers"
				:selected-key="selectedKey"
				@change-selection="onChangeSelection"
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
	</Toolbar>
</template>

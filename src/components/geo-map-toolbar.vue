<script lang="ts" setup>
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from "@heroicons/vue/24/outline";
import { computed, inject } from "vue";

import { type GeojsonLayer } from "@/api";
import IconButton from "@/components/icon-button.vue";
import SingleSelect from "@/components/single-select.vue";
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
			key: layer.id,
			label: layer.title,
			description: [layer.description, layer.attribution].filter(isNotNullable).join(" - "),
		});
	});

	return items;
});

function onChangeSelection(selectedKey: string) {
	//
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
			<div>
				<SingleSelect
					v-if="items.length > 0"
					:items="items"
					:label="label"
					name="custom-layers"
					:selected-key="selectedKey"
					@change-selection="onChangeSelection"
				/>
			</div>
		</aside>
	</div>
</template>

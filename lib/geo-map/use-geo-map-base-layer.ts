import { ref } from "vue";

import { baseLayers as _baseLayers } from "@/lib/geo-map/geo-map.config";

const baseLayers = Object.entries(_baseLayers).map(([key, layer]) => {
	return { key, label: layer.label };
});

export type BaseLayer = keyof typeof _baseLayers;

export function useGeoMapBaseLayer() {
	const baseLayer = ref(Object.keys(_baseLayers)[0]! as BaseLayer);

	function onChangeBaseLayer(key: BaseLayer) {
		baseLayer.value = key;
	}

	return { baseLayer, baseLayers, onChangeBaseLayer };
}

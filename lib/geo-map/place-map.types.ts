import type { CircleMarker, Map as LeafletMap, TileLayer } from "leaflet";

export interface PlaceMapContext {
	map: LeafletMap | null;
	baseLayer: TileLayer | null;
	points: Array<CircleMarker>;
}

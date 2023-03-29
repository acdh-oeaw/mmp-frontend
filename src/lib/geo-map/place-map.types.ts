import { type CircleMarker, type Map as LeafletMap, type TileLayer } from "leaflet";

export interface PlaceMapContext {
	map: LeafletMap | null;
	baseLayer: TileLayer | null;
	points: Array<CircleMarker>;
}

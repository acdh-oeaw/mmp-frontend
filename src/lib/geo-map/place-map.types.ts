import { type Map as LeafletMap, type Marker, type TileLayer } from "leaflet";

export interface PlaceMapContext {
	map: LeafletMap | null;
	baseLayer: TileLayer | null;
	points: Array<Marker>;
}

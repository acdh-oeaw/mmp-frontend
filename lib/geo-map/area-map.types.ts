import type { GeoJSON, Map as LeafletMap, TileLayer } from "leaflet";

import type { SpatialCoverageGeojson } from "@/api";
import type { SpatialCoverageCenterPoint } from "@/lib/geo-map/geo-map.types";

export interface AreaMapContext {
	areas: GeoJSON<SpatialCoverageGeojson["properties"]> | null;
	areaLabels: GeoJSON<SpatialCoverageCenterPoint["properties"]> | null;
	baseLayer: TileLayer | null;
	map: LeafletMap | null;
}

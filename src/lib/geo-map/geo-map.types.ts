import type { Feature, Point } from "geojson";
import { type GeoJSON, type Map as LeafletMap, type TileLayer } from "leaflet";

import type {
	ConeGeojson,
	GeojsonLayer,
	LinesPointsGeojson,
	PlaceGeojsonProperty,
	SpatialCoverageGeojson,
	SpatialCoverageGeojsonProperties,
} from "@/api";

export type ConeOriginGeojson = Feature<
	Point,
	{
		name: PlaceGeojsonProperty["name"];
		art: PlaceGeojsonProperty["art"];
		spatialCoverages: Map<SpatialCoverageGeojson["id"], SpatialCoverageGeojsonProperties>;
	}
> & { id: PlaceGeojsonProperty["id"] };

export type SpatialCoverageCenterPoint = Feature<Point, SpatialCoverageGeojson["properties"]> & {
	id: SpatialCoverageGeojson["id"];
};

export type FeatureLayers = {
	areas: GeoJSON<SpatialCoverageGeojson["properties"]> | null;
	areaLabels: GeoJSON<SpatialCoverageCenterPoint["properties"]> | null;
	cones: GeoJSON<ConeGeojson["properties"]> | null;
	coneOrigins: GeoJSON<ConeOriginGeojson["properties"]> | null;
	linesPoints: GeoJSON<LinesPointsGeojson["properties"]> | null;
};

export type HighlightFeatureLayers = {
	areas: GeoJSON<SpatialCoverageGeojson["properties"]> | null;
	cones: GeoJSON<ConeGeojson["properties"]> | null;
};

export interface GeoMapContext {
	map: LeafletMap | null;
	baseLayer: TileLayer | null;
	layers: Record<GeojsonLayer["id"], GeoJSON | null>;
	featureGroups: FeatureLayers;
	highlights: HighlightFeatureLayers;
}

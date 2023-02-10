import type { Feature, Point } from "geojson";

import type {
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

export type SpatialCoverageCenterPoint = Feature<
	Point,
	SpatialCoverageGeojson["properties"]
> & { id: SpatialCoverageGeojson["id"] };

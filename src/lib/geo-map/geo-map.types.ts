import type { Feature, Point } from 'geojson';

import type {
	PlaceGeojsonProperty,
	SpatialCoverageGeojson,
	SpatialCoverageGeojsonProperties,
} from '@/api';

export type ConeOriginGeojson = { id: PlaceGeojsonProperty['id'] } & Feature<
	Point,
	{
		name: PlaceGeojsonProperty['name'];
		art: PlaceGeojsonProperty['art'];
		spatialCoverages: Map<SpatialCoverageGeojson['id'], SpatialCoverageGeojsonProperties>;
	}
>;

export type SpatialCoverageCenterPoint = { id: SpatialCoverageGeojson['id'] } & Feature<
	Point,
	SpatialCoverageGeojson['properties']
>;

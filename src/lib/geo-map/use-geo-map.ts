import { type ComputedRef } from "vue";
import { computed } from "vue";

import {
	type ConeGeojson,
	type PlaceGeojsonProperty,
	useConesGeojson,
	useLinesPointsGeojson,
	useSpatialCoveragesGeojson,
} from "@/api";
import {
	type ConeOriginGeojson,
	type SpatialCoverageCenterPoint,
} from "@/lib/geo-map/geo-map.types";
import { useGeoMapSearchParams } from "@/lib/search/use-geo-map-search-params";
import { type SearchFilters } from "@/lib/search/use-search-filters";

export function useGeoMap(searchFilters: ComputedRef<SearchFilters>) {
	const searchParams = useGeoMapSearchParams(searchFilters);
	const areasQuery = useSpatialCoveragesGeojson(searchParams);
	const conesQuery = useConesGeojson(searchParams);
	const linesPointsQuery = useLinesPointsGeojson(searchParams);
	const isLoading = computed(() => {
		return [areasQuery, conesQuery, linesPointsQuery].some((query) => {
			return query.isInitialLoading.value;
		});
	});
	const isFetching = computed(() => {
		return [areasQuery, conesQuery, linesPointsQuery].some((query) => {
			return query.isFetching.value;
		});
	});
	const isError = computed(() => {
		return [areasQuery, conesQuery, linesPointsQuery].some((query) => {
			return query.isError.value;
		});
	});
	const areas = computed(() => {
		return areasQuery.data.value?.features ?? [];
	});
	const cones = computed(() => {
		return conesQuery.data.value?.features ?? [];
	});
	const linesPoints = computed(() => {
		return linesPointsQuery.data.value?.features ?? [];
	});
	const isEmpty = computed(() => {
		return areasQuery.data.value?.count === 0;
	});

	function getConeOrigins(feature: ConeGeojson) {
		return feature.properties.texts.flatMap((text) => {
			return text.places.filter((place) => {
				return place.lat != null && place.lng != null;
			});
		});
	}

	const coneOrigins = computed(() => {
		const points = new Map<PlaceGeojsonProperty["id"], ConeOriginGeojson>();

		conesQuery.data.value?.features.forEach((feature) => {
			/**
			 * Spatial coverage areas may be related to multiple passages.
			 * And passages themselves are allowed to have relations to multiple places, i.e. origin points.
			 */
			for (const place of getConeOrigins(feature)) {
				if (points.has(place.id)) {
					points.get(place.id)?.properties.spatialCoverages.set(feature.id, feature.properties);
				} else {
					const point: ConeOriginGeojson = {
						id: place.id,
						type: "Feature",
						geometry: {
							type: "Point",
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							coordinates: [place.lng!, place.lat!],
						},
						properties: {
							name: place.name,
							art: place.art,
							spatialCoverages: new Map([[feature.id, feature.properties]]),
						},
					};

					points.set(place.id, point);
				}
			}
		});

		return Array.from(points.values());
	});

	const areaCenterPoints = computed(() => {
		const points: Array<SpatialCoverageCenterPoint> = [];

		areasQuery.data.value?.features.forEach((feature) => {
			const [x1, y1, x2, y2] = feature.bbox as [number, number, number, number];
			const lng = (x1 + x2) / 2;
			const lat = (y1 + y2) / 2;

			const point: SpatialCoverageCenterPoint = {
				id: feature.id,
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: [lng, lat],
				},
				/** Use `key_word.stichwort` as label. */
				properties: feature.properties,
			};

			points.push(point);
		});

		return points;
	});

	return {
		areas,
		areaCenterPoints,
		areasQuery,
		cones,
		coneOrigins,
		conesQuery,
		linesPoints,
		linesPointsQuery,
		isEmpty,
		isError,
		isFetching,
		isLoading,
	};
}

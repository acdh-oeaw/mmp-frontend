import { computed, ref } from "vue";

import { type LinesPointsGeojson, type SpatialCoverageGeojson } from "@/api";
import {
	type ConeOriginGeojson,
	type SpatialCoverageCenterPoint,
} from "@/lib/geo-map/geo-map.types";
import { type SelectionKey, createSelectionKey } from "@/lib/search/selection-key";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { useRouter } from "#imports";

export function useGeoMapEvents() {
	const router = useRouter();
	const { createSearchFilterParams, searchFilters } = useSearchFilters();
	const { createSelectionParams, selection } = useSelection();
	const selectedKeys = computed<Set<SelectionKey>>(() => {
		return new Set(selection.value.selection);
	});

	function onAreaClick(area: SpatialCoverageCenterPoint | SpatialCoverageGeojson | null) {
		if (area == null) return;

		const key = createSelectionKey({ kind: "geojson-area", id: area.id });
		const _selection = new Set(selectedKeys.value);
		if (_selection.has(key)) {
			_selection.delete(key);
		} else {
			_selection.add(key);
		}

		router.push({
			query: {
				...createSearchFilterParams(searchFilters.value),
				...createSelectionParams({ selection: Array.from(_selection) }),
			},
		});
	}

	function onPointClick(point: ConeOriginGeojson | null) {
		if (point == null) return;

		const key = createSelectionKey({ kind: "geojson-point", id: point.id });
		const _selection = new Set(selectedKeys.value);
		if (_selection.has(key)) {
			_selection.delete(key);
		} else {
			_selection.add(key);
		}

		router.push({
			query: {
				...createSearchFilterParams(searchFilters.value),
				...createSelectionParams({ selection: Array.from(_selection) }),
			},
		});
	}

	function onLinesPointsClick(collection: LinesPointsGeojson | null) {
		if (collection == null) return;

		const key = createSelectionKey({ kind: "geojson-collection", id: collection.id });
		const _selection = new Set(selectedKeys.value);
		if (_selection.has(key)) {
			_selection.delete(key);
		} else {
			_selection.add(key);
		}

		router.push({
			query: {
				...createSearchFilterParams(searchFilters.value),
				...createSelectionParams({ selection: Array.from(_selection) }),
			},
		});
	}

	//

	const highlightedKeys = ref(new Set<SelectionKey>());

	function onAreaHover(area: SpatialCoverageCenterPoint | SpatialCoverageGeojson | null) {
		if (area == null) return;
	}

	function onPointHover(point: ConeOriginGeojson | null) {
		if (point == null) return;
	}

	function onLinesPointsHover(collection: LinesPointsGeojson | null) {
		if (collection == null) return;
	}

	return {
		highlightedKeys,
		selectedKeys,
		onAreaClick,
		onAreaHover,
		onLinesPointsClick,
		onLinesPointsHover,
		onPointClick,
		onPointHover,
	};
}

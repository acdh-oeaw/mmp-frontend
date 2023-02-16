import { type ComputedRef, computed } from "vue";

import type { GetConesGeojson, GetLinesPointsGeojson, GetSpatialCoveragesGeojson } from "@/api";
import { type SearchFilters } from "@/lib/search/use-search-filters";

type SearchParams =
	| GetConesGeojson.SearchParams
	| GetLinesPointsGeojson.SearchParams
	| GetSpatialCoveragesGeojson.SearchParams;

export function useGeoMapSearchParams(
	searchFilters: ComputedRef<SearchFilters>,
): ComputedRef<SearchParams> {
	const searchParams = computed<SearchParams>(() => {
		function getDateFilters() {
			const [start, end] = Array.isArray(searchFilters.value["date-range"])
				? searchFilters.value["date-range"]
				: [searchFilters.value["date-range"] - 5, searchFilters.value["date-range"] + 4];

			const dateFilters: SearchParams =
				searchFilters.value["date-filter"] === "content"
					? {
							stelle__start_date: start,
							stelle__start_date_lookup: "gt",
							stelle__end_date: end,
							stelle__end_date_lookup: "lt",
					  }
					: {
							stelle__text__not_before: start,
							stelle__text__not_before_lookup: "gt",
							stelle__text__not_after: end,
							stelle__text__not_after_lookup: "lt",
					  };

			return dateFilters;
		}

		const searchParams: SearchParams = {
			stelle: searchFilters.value["passage"],
			[searchFilters.value["query-mode"] === "intersection"
				? "stelle__text__autor_and"
				: "stelle__text__autor"]: searchFilters.value["author"],
			// FIXME: on other screens we filter passages by keyword, but (i) spatial coverages
			// can be related to multiple passages, and (ii) spatial coverages have a separate
			// keyword field - which is why we are querying `key_word`, not `stelle__hey_word`.
			[searchFilters.value["query-mode"] === "intersection" ? "key_word_and" : "key_word"]:
				searchFilters.value["keyword"],
			stelle__use_case: searchFilters.value["case-study"],
			stelle__text__ort: searchFilters.value["place"],
			stelle__has_usecase: searchFilters.value["dataset"] === "case-studies",
			...getDateFilters(),
			// page: searchFilters.value['limit'] + 1,
			// page_size: searchFilters.value['limit'] * searchFilters.value['offset'],
			page: 1,
			page_size: 1000,
		};

		return searchParams;
	});

	return searchParams;
}

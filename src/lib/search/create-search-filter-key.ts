import { assert } from "@acdh-oeaw/lib";

import type { ResourceKind } from "@/api";
import type { SearchFilters } from "@/lib/search/use-search-filters";

export function createSearchFilterKey(
	kind: ResourceKind,
): Extract<keyof SearchFilters, "author" | "case-study" | "keyword" | "passage" | "place"> {
	switch (kind) {
		case "autor":
			return "author";
		case "keyword":
			return "keyword";
		case "ort":
			return "place";
		case "stelle":
			return "passage";
		case "usecase":
			return "case-study";
		default:
			assert(false);
	}
}

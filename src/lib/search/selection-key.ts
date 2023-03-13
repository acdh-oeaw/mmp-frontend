import { type LocationQuery } from "vue-router";

import {
	type LinesPointsGeojson,
	type Resource,
	type ResourceKind,
	type SpatialCoverageGeojson,
} from "@/api";
import {
	type ConeOriginGeojson,
	type SpatialCoverageCenterPoint,
} from "@/lib/geo-map/geo-map.types";
import { isNonEmptyString } from "@/lib/is-nonempty-string";
import { resourceKinds } from "@/lib/search/resource-key";
import { unique } from "@/lib/unique";

export type SelectionResource =
	| ConeOriginGeojson
	| LinesPointsGeojson
	| Resource
	| SpatialCoverageCenterPoint
	| SpatialCoverageGeojson;
const selectionKinds = [
	...resourceKinds,
	"geojson-area",
	"geojson-collection",
	"geojson-point",
] as const;
export type SelectionKind = (typeof selectionKinds)[number];
export type SelectionKey = `${SelectionKind}_${SelectionResource["id"]}`;
export type SelectionIdentifier = { kind: SelectionKind; id: SelectionResource["id"] };

export function createSelectionKey(params: SelectionIdentifier): SelectionKey {
	return [params.kind, params.id].join("_") as SelectionKey;
}

export function splitSelectionKey(key: SelectionKey): SelectionIdentifier {
	const [kind, id] = key.split("_");
	return { kind: kind as ResourceKind, id: Number(id) };
}

export function isSelectionKey(value: unknown): value is SelectionKey {
	if (typeof value !== "string") return false;

	const [kind, id] = value.split("_");

	if (!isNonEmptyString(id)) return false;
	if (Number.isNaN(Number(id))) return false;

	if (!isNonEmptyString(kind)) return false;
	if (!selectionKinds.includes(kind as ResourceKind)) return false;

	return true;
}

export function getSelectionKeys(param: LocationQuery[string] | undefined): Array<SelectionKey> {
	const value = Array.isArray(param) ? param : [param ?? null];
	const keys = value.filter(isSelectionKey);
	return unique(keys);
}

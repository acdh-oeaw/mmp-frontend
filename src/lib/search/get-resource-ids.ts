import type { LocationQuery } from "vue-router";

import type { Resource } from "@/api";
import { isNotNullable } from "@/lib/is-not-nullable";
import { unique } from "@/lib/unique";

export function getResourceIds(param: LocationQuery[string] | undefined): Array<Resource["id"]> {
	const value = Array.isArray(param) ? param : [param ?? null];
	const ids = value.filter(isNotNullable).map(Number);

	return unique(ids);
}

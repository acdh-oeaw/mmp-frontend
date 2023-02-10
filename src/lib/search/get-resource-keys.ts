import type { LocationQuery } from "vue-router";

import { type ResourceKey } from "@/api";
import { isResourceKey } from "@/lib/search/resource-key";
import { unique } from "@/lib/unique";

export function getResourceKeys(param: LocationQuery[string] | undefined): Array<ResourceKey> {
	const value = Array.isArray(param) ? param : [param ?? null];
	const keys = value.filter(isResourceKey);
	return unique(keys);
}

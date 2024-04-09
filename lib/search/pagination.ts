import type { LocationQuery } from "vue-router";

import { defaultLimit, maxLimit } from "@/lib/search/pagination.config";

export function getLimit(param: LocationQuery[string] | undefined): number {
	const value = Array.isArray(param) ? param[0] : param;
	if (value == null) return defaultLimit;
	const limit = Number(value);
	if (limit <= 0 || limit > maxLimit) return defaultLimit;
	return limit;
}

export function getOffset(param: LocationQuery[string] | undefined): number {
	const value = Array.isArray(param) ? param[0] : param;
	if (value == null) return 0;
	const offset = Number(value);
	if (offset < 0) return 0;
	return offset;
}

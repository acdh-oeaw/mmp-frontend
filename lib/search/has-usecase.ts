import { type DataSet } from "@/lib/search/use-search-filters";

export function hasUseCase(value: DataSet): boolean | undefined {
	if (value === "case-studies") return true;
	if (value === "gens") return false;
	return undefined;
}

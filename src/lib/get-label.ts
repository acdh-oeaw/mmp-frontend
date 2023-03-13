import type { Author, Passage, Place } from "@/api";
import { isNotNullable } from "@/lib/is-not-nullable";

export function getAuthorLabel(
	value:
		| Pick<Author, "name_en" | "name_fr" | "name_gr" | "name_it" | "name_lat" | "name">
		| null
		| undefined,
): string {
	if (value == null) return "Unknown author";

	return (
		value.name_en || value.name_lat || value.name || value.name_fr || value.name_it || value.name_gr
	);
}

export function getPlaceLabel(
	value:
		| Pick<Place, "name_antik" | "name_de" | "name_fr" | "name_gr" | "name_it" | "name">
		| null
		| undefined,
): string {
	if (value == null) return "Unknown place";

	return (
		value.name_antik ||
		value.name ||
		value.name_de ||
		value.name_fr ||
		value.name_it ||
		value.name_gr
	);
}

export function getDateRangeLabel(
	start: number | null | undefined,
	end: number | null | undefined,
): string {
	return [start, end]
		.filter(isNotNullable)
		.map((value) => {
			return value < 0 ? `${-value} BC` : `${value} AD`;
		})
		.join(" - ");
}

export function getPassageLabel(
	passage: Pick<Passage, "display_label" | "text"> | null | undefined,
) {
	const label = passage?.display_label;

	if (label == null) return "Unknown title";

	return label;
}

/** Passage panel title. */
export function getPassagePanelLabel(
	passage: Pick<Passage, "display_label" | "text" | "zitat_stelle"> | null | undefined,
) {
	if (passage?.text?.title == null || passage.zitat_stelle == null) {
		return getPassageLabel(passage);
	}

	return `${passage.text.title}, ${passage.zitat_stelle}`;
}

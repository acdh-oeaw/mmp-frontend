import { computed } from "vue";

import {
	type SelectionKind,
	type SelectionResource,
	splitSelectionKey,
} from "@/lib/search/selection-key";
import { useSelection } from "@/lib/search/use-selection";

export function useSelectionByKind() {
	const { selection } = useSelection();

	const selectionByKind = computed(() => {
		const grouped = new Map<SelectionKind, Set<SelectionResource["id"]>>();

		selection.value.selection.forEach((key) => {
			const { kind, id } = splitSelectionKey(key);

			if (grouped.has(kind)) {
				grouped.get(kind)!.add(id);
			} else {
				grouped.set(kind, new Set([id]));
			}
		});

		return grouped;
	});

	return selectionByKind;
}

import { computed, type ComputedRef } from "vue";

import type { Resource } from "@/api";
import { useRoute } from "#imports";

export function useResourceIdParam(): ComputedRef<Resource["id"]> {
	const route = useRoute();

	const id = computed(() => {
		return Number(route.params.id);
	});

	return id;
}

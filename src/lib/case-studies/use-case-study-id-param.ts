import { type ComputedRef, computed } from "vue";

import { type CaseStudy } from "@/api";
import { useRoute } from "#imports";

export function useCaseStudyIdParam(): ComputedRef<CaseStudy["id"]> {
	const route = useRoute();

	const id = computed(() => {
		return Number(route.params["id"]);
	});

	return id;
}

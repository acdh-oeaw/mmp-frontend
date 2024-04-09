import { type ComputedRef, computed } from "vue";

import { type CaseStudy, useEvents } from "@/api";

export function useCaseStudyEvent(id: ComputedRef<CaseStudy["id"]>) {
	const caseStudyEventQuery = useEvents({ use_case: [id], limit: 100, ordering: "start_date" });
	const isFetching = caseStudyEventQuery.isFetching;
	const isLoading = caseStudyEventQuery.isInitialLoading;
	const isError = caseStudyEventQuery.isError;
	const caseStudyEvents = computed(() => {
		return caseStudyEventQuery.data.value?.results ?? [];
	});

	const isEmpty = computed(() => {
		return caseStudyEventQuery.data.value?.count === 0;
	});

	return {
		caseStudyEvents,
		caseStudyEventQuery,
		isEmpty,
		isError,
		isFetching,
		isLoading,
	};
}

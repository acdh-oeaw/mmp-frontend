import { type ComputedRef, computed } from "vue";

import { type CaseStudy, useCaseStudyTimeTableById } from "@/api";

export function useCaseStudyTimeline(id: ComputedRef<CaseStudy["id"]>) {
	const caseStudyTimelineQuery = useCaseStudyTimeTableById({ id });
	const isFetching = caseStudyTimelineQuery.isFetching;
	const isLoading = caseStudyTimelineQuery.isInitialLoading;
	const isError = caseStudyTimelineQuery.isError;
	const caseStudyTimeline = computed(() => {
		return caseStudyTimelineQuery.data.value ?? [];
	});
	const isEmpty = computed(() => {
		return caseStudyTimeline.value.length === 0;
	});

	return {
		caseStudyTimeline,
		caseStudyTimelineQuery,
		isEmpty,
		isError,
		isFetching,
		isLoading,
	};
}

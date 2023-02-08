import { computed } from 'vue';

import type { GetCaseStudies } from '@/api';
import { useCaseStudiesSearchFilters } from '@/lib/search/use-case-studies-search-filters';

export function useCaseStudiesSearchParams() {
  const { searchFilters } = useCaseStudiesSearchFilters();
  const searchParams = computed<GetCaseStudies.SearchParams>(() => {
    const searchParams: GetCaseStudies.SearchParams = {
      has_stelle__text__autor: searchFilters.value.author,
      has_stelle__key_word: searchFilters.value.keyword,
      limit: searchFilters.value['limit'],
      offset: searchFilters.value['offset'],
    };

    return searchParams;
  });

  return searchParams;
}

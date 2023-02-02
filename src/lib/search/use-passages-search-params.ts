import { type ComputedRef, computed } from 'vue';

import type { GetPassages } from '@/api';
import { isNonEmptyArray } from '@/lib/is-nonempty-array';
import { useSearchFilters } from '@/lib/search/use-search-filters';

export function usePassagesSearchParams(): ComputedRef<GetPassages.SearchParams> {
  const { searchFilters } = useSearchFilters();

  const searchParams = computed<GetPassages.SearchParams>(() => {
    function getDateFilters() {
      const [start, end] = Array.isArray(searchFilters.value['date-range'])
        ? searchFilters.value['date-range']
        : [searchFilters.value['date-range'] - 5, searchFilters.value['date-range'] + 4];

      const dateFilters: GetPassages.SearchParams =
        searchFilters.value['date-filter'] === 'content'
          ? {
              start_date: start,
              start_date_lookup: 'gt',
              end_date: end,
              end_date_lookup: 'lt',
            }
          : {
              text__start_date: start,
              text__start_date_lookup: 'gt',
              text__end_date: end,
              text__end_date_lookup: 'lt',
            };

      return dateFilters;
    }

    const searchParams: GetPassages.SearchParams = {
      ids: isNonEmptyArray(searchFilters.value['passage'])
        ? searchFilters.value['passage'].join(',')
        : undefined,
      [searchFilters.value['query-mode'] === 'intersection' ? 'text__autor_and' : 'text__autor']:
        searchFilters.value['author'],
      [searchFilters.value['query-mode'] === 'intersection' ? 'key_word_and' : 'key_word']:
        searchFilters.value['keyword'],
      use_case: searchFilters.value['case-study'],
      text__ort: searchFilters.value['place'],
      has_usecase: searchFilters.value['dataset'] === 'case-studies',
      ...getDateFilters(),
      limit: searchFilters.value['limit'],
      offset: searchFilters.value['offset'],
    };

    return searchParams;
  });

  return searchParams;
}
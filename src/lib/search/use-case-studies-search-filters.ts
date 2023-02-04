import { type ComputedRef, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

import type { Author, Keyword } from '@/api';
import { noop } from '@/lib/noop';
import { getResourceIds } from '@/lib/search/get-resource-ids';
import { getLimit, getOffset } from '@/lib/search/pagination';
import { defaultLimit } from '@/lib/search/pagination.config';
import { unique } from '@/lib/unique';
import type { LocationQuery } from '@/types/router';

export type SearchFilters = {
  author: Array<Author['id']>;
  keyword: Array<Keyword['id']>;
  limit: number;
  offset: number;
};

type UseSearchFiltersResult = {
  searchFilters: ComputedRef<SearchFilters>;
  setSearchFilters: (searchFilters: SearchFilters) => void;
  createSearchFilterParams: (searchFilters: SearchFilters) => LocationQuery;
  defaultSearchFilters: SearchFilters;
};

export const defaultSearchFilters = Object.freeze({
  author: [],
  keyword: [],
  limit: defaultLimit,
  offset: 0,
} satisfies SearchFilters);

export function useCaseStudiesSearchFilters(): UseSearchFiltersResult {
  const router = useRouter();
  const route = useRoute();

  const searchFilters = computed<SearchFilters>(() => {
    const searchFilters: SearchFilters = {
      author: getResourceIds(route.query['author']),
      keyword: getResourceIds(route.query['keyword']),
      limit: getLimit(route.query['limit']),
      offset: getOffset(route.query['offset']),
    };

    return searchFilters;
  });

  function setSearchFilters(searchFilters: SearchFilters) {
    const query = createSearchFilterParams(searchFilters);
    router.push({ query }).catch(noop);
  }

  return {
    searchFilters,
    setSearchFilters,
    createSearchFilterParams,
    defaultSearchFilters,
  };
}

function createSearchFilterParams(searchFilters: SearchFilters): LocationQuery {
  const searchParams: LocationQuery = {};

  if (searchFilters['author'].length > 0) {
    searchParams['author'] = unique(searchFilters['author']).map(String);
  }

  if (searchFilters['keyword'].length > 0) {
    searchParams['keyword'] = unique(searchFilters['keyword']).map(String);
  }

  return searchParams;
}

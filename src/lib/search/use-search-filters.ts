import { type ComputedRef, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

import type { Author, CaseStudy, Keyword, Passage, Place } from '@/api';
import { isNonEmptyString } from '@/lib/is-nonempty-string';
import { noop } from '@/lib/noop';
import { getResourceIds } from '@/lib/search/get-resource-ids';
import { getLimit, getOffset } from '@/lib/search/pagination';
import { defaultLimit } from '@/lib/search/pagination.config';
import { maxYear, minYear } from '@/lib/search/search.config';
import { unique } from '@/lib/unique';
import type { LocationQuery, LocationQueryValue } from '@/types/router';

export const queryModes = ['intersection', 'union'] as const;
export type QueryMode = typeof queryModes[number];

export const dataSets = ['all', 'case-studies', 'gens'] as const;
export type DataSet = typeof dataSets[number];

export const dateFilters = ['content', 'composition'] as const;
export type DateFilter = typeof dateFilters[number];

export type SearchFilters = {
  author: Array<Author['id']>;
  'case-study': Array<CaseStudy['id']>;
  keyword: Array<Keyword['id']>;
  passage: Array<Passage['id']>;
  place: Array<Place['id']>;
  'date-range': number | [number, number];
  'date-filter': DateFilter;
  dataset: DataSet;
  'query-mode': QueryMode;
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
  'case-study': [],
  keyword: [],
  passage: [],
  place: [],
  'date-range': [minYear, maxYear],
  'date-filter': 'composition',
  dataset: 'case-studies',
  'query-mode': 'intersection',
  limit: defaultLimit,
  offset: 0,
} satisfies SearchFilters);

export function useSearchFilters(): UseSearchFiltersResult {
  const router = useRouter();
  const route = useRoute();

  const searchFilters = computed<SearchFilters>(() => {
    const searchFilters: SearchFilters = {
      author: getResourceIds(route.query['author']),
      /**
       * There's an asymmetry in search filter handling, because it is allowed
       * to set multiple "case-study" filters via search params, but the
       * separate `/case-study/:id` routes *also* set "case-study" to the route param.
       *
       * TODO: should we just append case study search param to `/case-study/:id?case-study=id`.
       *
       * FIXME: add child routes for case-study
       */
      'case-study':
        route.name === 'Case Study'
          ? [Number(route.params.id)]
          : getResourceIds(route.query['case-study']),
      keyword: getResourceIds(route.query['keyword']),
      passage: getResourceIds(route.query['passage']),
      place: getResourceIds(route.query['place']),
      'date-range': getDateRange(route.query['date-range']),
      'date-filter': getDateFilter(route.query['date-filter']),
      dataset: getDataSet(route.query['dataset']),
      'query-mode': getQueryMode(route.query['query-mode']),
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

//

function isValidNumber(value: number) {
  return !Number.isNaN(value) && value >= minYear && value <= maxYear;
}

function getDateRange(param: LocationQueryValue | undefined) {
  const values = Array.isArray(param) ? param : [param ?? null];
  const numbers = values
    .filter(isNonEmptyString)
    .map(Number)
    .filter(isValidNumber)
    .sort((a, z) => {
      return a - z;
    });
  if (numbers.length === 0) return defaultSearchFilters['date-range'];
  if (numbers.length === 1) return numbers[0] as number;
  if (numbers.length === 2) return numbers as [number, number];
  return defaultSearchFilters['date-range'];
}

function isDataSet(value: string): value is DataSet {
  return dataSets.includes(value as DataSet);
}

function getDataSet(param: LocationQueryValue | undefined) {
  const value = Array.isArray(param) ? param[0] : param;
  if (value == null) return defaultSearchFilters['dataset'];
  if (isDataSet(value)) return value;
  return defaultSearchFilters['dataset'];
}

function isQueryMode(value: string): value is QueryMode {
  return queryModes.includes(value as QueryMode);
}

function getQueryMode(param: LocationQueryValue | undefined) {
  const value = Array.isArray(param) ? param[0] : param;
  if (value == null) return defaultSearchFilters['query-mode'];
  if (isQueryMode(value)) return value;
  return defaultSearchFilters['query-mode'];
}

function isDateFilter(value: string): value is DateFilter {
  return dateFilters.includes(value as DateFilter);
}

function getDateFilter(param: LocationQueryValue | undefined) {
  const value = Array.isArray(param) ? param[0] : param;
  if (value == null) return defaultSearchFilters['date-filter'];
  if (isDateFilter(value)) return value;
  return defaultSearchFilters['date-filter'];
}

function createSearchFilterParams(searchFilters: SearchFilters): LocationQuery {
  const searchParams: LocationQuery = {};

  if (searchFilters['author'].length > 0) {
    searchParams['author'] = unique(searchFilters['author']).map(String);
  }

  if (searchFilters['case-study'].length > 0) {
    searchParams['case-study'] = unique(searchFilters['case-study']).map(String);
  }

  if (searchFilters['keyword'].length > 0) {
    searchParams['keyword'] = unique(searchFilters['keyword']).map(String);
  }

  if (searchFilters['passage'].length > 0) {
    searchParams['passage'] = unique(searchFilters['passage']).map(String);
  }

  if (searchFilters['place'].length > 0) {
    searchParams['place'] = unique(searchFilters['place']).map(String);
  }

  if (Array.isArray(searchFilters['date-range'])) {
    if (
      searchFilters['date-range'][0] !== defaultSearchFilters['date-range'][0] ||
      searchFilters['date-range'][1] !== defaultSearchFilters['date-range'][1]
    ) {
      searchParams['date-range'] = searchFilters['date-range'].map(String);
    }
  } else {
    searchParams['date-range'] = String(searchFilters['date-range']);
  }

  if (searchFilters['date-filter'] !== defaultSearchFilters['date-filter']) {
    searchParams['date-filter'] = searchFilters['date-filter'];
  }

  if (searchFilters['dataset'] !== defaultSearchFilters['dataset']) {
    searchParams['dataset'] = searchFilters['dataset'];
  }

  if (searchFilters['query-mode'] !== defaultSearchFilters['query-mode']) {
    searchParams['query-mode'] = searchFilters['query-mode'];
  }

  if (searchFilters['limit'] !== defaultSearchFilters['limit']) {
    searchParams['limit'] = String(searchFilters['limit']);
  }

  if (searchFilters['offset'] !== defaultSearchFilters['offset']) {
    searchParams['offset'] = String(searchFilters['offset']);
  }

  return searchParams;
}

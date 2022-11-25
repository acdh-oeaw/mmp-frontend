import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

import type { Author, CaseStudy, Keyword, Passage, Place } from '@/api';
import { isNonEmptyString } from '@/lib/is-nonempty-string';
import { isNotNullable } from '@/lib/is-not-nullable';
import { maxYear, minYear } from '@/lib/search/search.config';
import { unique } from '@/lib/unique';

export const queryModes = ['intersection', 'union'] as const;
export type QueryMode = typeof queryModes[number];

export const dataSets = ['all', 'case-studies', 'gens'] as const;
export type DataSet = typeof dataSets[number];

export const dateFilters = ['content', 'composition'] as const;
export type DateFilter = typeof dateFilters[number];

// TODO: doc comments for search filters
// TODO: maybe use provide/inject
// TODO: maybe more granular reactivity for route.query

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
} satisfies SearchFilters);

export function useSearchFilters() {
  const router = useRouter();
  const route = useRoute();

  const searchFilters = computed<SearchFilters>(() => {
    return {
      author: getIds(route.query['author']),
      'case-study': getIds(route.query['case-study']),
      keyword: getIds(route.query['keyword']),
      passage: getIds(route.query['passage']),
      place: getIds(route.query['place']),
      'date-range': getDateRange(route.query['date-range']),
      'date-filter': getDateFilter(route.query['date-filter']),
      dataset: getDataSet(route.query['dataset']),
      'query-mode': getQueryMode(route.query['query-mode']),
    };
  });

  function setSearchFilters(searchFilters: SearchFilters, name?: string) {
    const query = serializeSearchFilters(searchFilters);
    router.push({ name, query });
  }

  function createSearchFilterParams(searchFilters: SearchFilters) {
    return serializeSearchFilters(searchFilters);
  }

  return {
    searchFilters,
    setSearchFilters,
    createSearchFilterParams,
  };
}

//

type RouteQueryParam = string | null | Array<string | null>;

function getIds(param: RouteQueryParam | undefined) {
  const values = Array.isArray(param) ? param : [param];
  return unique(values.filter(isNotNullable).map(Number));
}

function isValidNumber(value: number) {
  return !Number.isNaN(value) && value >= minYear && value <= maxYear;
}

function getDateRange(param: RouteQueryParam | undefined) {
  const values = Array.isArray(param) ? param : [param];
  const numbers = values.filter(isNonEmptyString).map(Number).filter(isValidNumber).sort();
  if (numbers.length === 0) return defaultSearchFilters['date-range'];
  if (numbers.length === 1) return numbers[0] as number;
  if (numbers.length === 2) return numbers as [number, number];
  return defaultSearchFilters['date-range'];
}

function isDataSet(value: string): value is DataSet {
  return dataSets.includes(value as DataSet);
}

function getDataSet(param: RouteQueryParam | undefined) {
  const value = Array.isArray(param) ? param[0] : param;
  if (value == null) return defaultSearchFilters['dataset'];
  if (isDataSet(value)) return value;
  return defaultSearchFilters['dataset'];
}

function isQueryMode(value: string): value is QueryMode {
  return queryModes.includes(value as QueryMode);
}

function getQueryMode(param: RouteQueryParam | undefined) {
  const value = Array.isArray(param) ? param[0] : param;
  if (value == null) return defaultSearchFilters['query-mode'];
  if (isQueryMode(value)) return value;
  return defaultSearchFilters['query-mode'];
}

function isDateFilter(value: string): value is DateFilter {
  return dateFilters.includes(value as DateFilter);
}

function getDateFilter(param: RouteQueryParam | undefined) {
  const value = Array.isArray(param) ? param[0] : param;
  if (value == null) return defaultSearchFilters['date-filter'];
  if (isDateFilter(value)) return value;
  return defaultSearchFilters['date-filter'];
}

function serializeSearchFilters(searchFilters: SearchFilters) {
  // TODO: clean up
  const query = {
    author: unique(searchFilters['author']).map(String),
    'case-study': unique(searchFilters['case-study']).map(String),
    keyword: unique(searchFilters['keyword']).map(String),
    passage: unique(searchFilters['passage']).map(String),
    place: unique(searchFilters['place']).map(String),
    'date-range': Array.isArray(searchFilters['date-range'])
      ? searchFilters['date-range'].length === defaultSearchFilters['date-range'].length &&
        searchFilters['date-range'][0] === defaultSearchFilters['date-range'][0] &&
        searchFilters['date-range'][1] === defaultSearchFilters['date-range'][1]
        ? undefined
        : searchFilters['date-range'].map(String)
      : String(searchFilters['date-range']),
    'date-filter':
      searchFilters['date-filter'] === defaultSearchFilters['date-filter']
        ? undefined
        : searchFilters['date-filter'],
    dataset:
      searchFilters['dataset'] === defaultSearchFilters['dataset']
        ? undefined
        : searchFilters['dataset'],
    'query-mode':
      searchFilters['query-mode'] === defaultSearchFilters['query-mode']
        ? undefined
        : searchFilters['query-mode'],
  };

  return query;
}

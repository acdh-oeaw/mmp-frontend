import { assert } from '@stefanprobst/assert';
import type { UseQueryOptions } from '@tanstack/vue-query';
import { useQuery } from '@tanstack/vue-query';
import type { Ref } from 'vue';

import * as api from '@/api/client';

type MaybeRef<T> = Ref<T> | T;

type MaybeRefDeep<T> = MaybeRef<
  T extends Array<unknown> | Record<string, unknown>
    ? {
        [K in keyof T]: MaybeRefDeep<T[K]>;
      }
    : T
>;

type Options = {
  isEnabled?: UseQueryOptions['enabled'];
  keepPreviousData?: UseQueryOptions['keepPreviousData'];
};

function getQueryOptions(options?: Options) {
  const queryOptions: Pick<UseQueryOptions, 'enabled' | 'keepPreviousData'> = {};

  if (options == null) return queryOptions;

  if (options.isEnabled != null) {
    queryOptions.enabled = options.isEnabled;
  }

  if (options.keepPreviousData != null) {
    queryOptions.keepPreviousData = options.keepPreviousData;
  }

  return queryOptions;
}

const resources = [
  'author',
  'autocomplete',
  'autocomplete-author',
  'autocomplete-case-study',
  'autocomplete-keyword',
  'autocomplete-keyword-region',
  'autocomplete-keyword-ethnonym',
  'autocomplete-keyword-keyword',
  'autocomplete-keyword-name',
  'autocomplete-place',
  'autocomplete-passage',
  'autocomplete-text',
  'autocomplete-text-genre-type',
  'autocomplete-place-type',
  'autocomplete-place-category',
  'case-study',
  'event',
  'geojson-layer',
  'geojson-place',
  'geojson-fuzzy-place',
  'geojson-cone',
  'geojson-spatial-coverage',
  'geojson-lines-points',
  'keyword',
  'modeling-process',
  'passage',
  'place',
  'skos-collection',
  'skos-concept',
  'skos-concept-scheme',
  'spatial-coverage',
  'stop-word',
  'story',
  'story-slide',
  'text',
  'text-topic-relation',
  'topic',
] as const;

const scopes = ['list', 'by-id'] as const;

export function createKey<
  TResource extends typeof resources[number],
  TScope extends typeof scopes[number],
  TArgs extends Array<MaybeRef<unknown>>
>(resource: TResource, scope: TScope, ...args: TArgs) {
  return [resource, scope, ...args] as const;
}

function assertParams<T extends object, K extends keyof T>(params: T, keys: Array<K>) {
  keys.forEach((key) => {
    assert(params[key], `Param ${String(key)} is required.`);
  });
  return params as SetRequired<T, typeof keys[number]>;
}

export function useAuthors(
  searchParams: MaybeRefDeep<Partial<api.GetAuthors.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('author', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getAuthors(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useAuthorById(
  params: MaybeRefDeep<Partial<api.GetAuthorById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('author', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getAuthorById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useKeywords(
  searchParams: MaybeRefDeep<Partial<api.GetKeywords.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('keyword', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getKeywords(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useKeywordById(
  params: MaybeRefDeep<Partial<api.GetKeywordById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('keyword', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getKeywordById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useKeywordByCenturyById(
  params: MaybeRefDeep<Partial<api.GetKeywordById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('keyword', 'by-id', params, 'century'),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getKeywordByCenturyById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useKeywordGraph(
  searchParams: MaybeRefDeep<Partial<api.GetKeywordGraph.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('keyword', 'list', searchParams, 'graph'),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getKeywordGraph(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function usePassages(
  searchParams: MaybeRefDeep<Partial<api.GetPassages.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('passage', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getPassages(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function usePassageById(
  params: MaybeRefDeep<Partial<api.GetPassageById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('passage', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getPassageById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function usePassageKeywords(
  searchParams: MaybeRefDeep<Partial<api.GetPassageKeywords.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('passage', 'list', searchParams, 'keywords'),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getPassageKeywords(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function usePassageNlpData(
  searchParams: MaybeRefDeep<Partial<api.GetPassageNlpData.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('passage', 'list', searchParams, 'nlp-data'),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getPassageNlpData(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function usePlaces(
  searchParams: MaybeRefDeep<Partial<api.GetPlaces.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('place', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getPlaces(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function usePlaceById(
  params: MaybeRefDeep<Partial<api.GetPlaceById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('place', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getPlaceById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useTexts(
  searchParams: MaybeRefDeep<Partial<api.GetTexts.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('text', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getTexts(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useTextById(
  params: MaybeRefDeep<Partial<api.GetTextById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('text', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getTextById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useCaseStudies(
  searchParams: MaybeRefDeep<Partial<api.GetCaseStudies.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('case-study', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getCaseStudies(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useCaseStudyById(
  params: MaybeRefDeep<Partial<api.GetCaseStudyById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('case-study', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getCaseStudyById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useCaseStudyTimeTableById(
  params: MaybeRefDeep<Partial<api.GetCaseStudyTimetableById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('case-study', 'by-id', params, 'timetable'),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getCaseStudyTimetableById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useGeojsonLayers(
  searchParams: MaybeRefDeep<Partial<api.GetGeojsonLayers.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-layer', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getGeojsonLayers(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useGeojsonLayerById(
  params: MaybeRefDeep<Partial<api.GetGeojsonLayerById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-layer', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getGeojsonLayerById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useEvents(
  searchParams: MaybeRefDeep<Partial<api.GetEvents.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('event', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getEvents(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useEventById(
  params: MaybeRefDeep<Partial<api.GetEventById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('event', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getEventById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useModelingProcesses(
  searchParams: MaybeRefDeep<Partial<api.GetModelingProcesses.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('modeling-process', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getModelingProcesses(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useModelingProcessById(
  params: MaybeRefDeep<Partial<api.GetModelingProcessById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('modeling-process', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getModelingProcessById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useStopWords(
  searchParams: MaybeRefDeep<Partial<api.GetStopWords.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('stop-word', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getStopWords(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useTextTopicRelations(
  searchParams: MaybeRefDeep<Partial<api.GetTextTopicRelations.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('text-topic-relation', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getTextTopicRelations(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useTextTopicRelationById(
  params: MaybeRefDeep<Partial<api.GetTextTopicRelationById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('text-topic-relation', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getTextTopicRelationById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useTopics(
  searchParams: MaybeRefDeep<Partial<api.GetTopics.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('topic', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getTopics(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useTopicById(
  params: MaybeRefDeep<Partial<api.GetTopicById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('topic', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getTopicById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function usePlacesGeojson(
  searchParams: MaybeRefDeep<Partial<api.GetPlacesGeojson.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-place', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getPlacesGeojson(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function usePlaceGeojsonById(
  params: MaybeRefDeep<Partial<api.GetPlaceGeojsonById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-place', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getPlaceGeojsonById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useFuzzyPlacesGeojson(
  searchParams: MaybeRefDeep<Partial<api.GetFuzzyPlacesGeojson.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-fuzzy-place', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getFuzzyPlacesGeojson(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useFuzzyPlaceGeojsonById(
  params: MaybeRefDeep<Partial<api.GetFuzzyPlaceGeojsonById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-fuzzy-place', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getFuzzyPlaceGeojsonById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useConesGeojson(
  searchParams: MaybeRefDeep<Partial<api.GetConesGeojson.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-cone', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getConesGeojson(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useConeGeojsonById(
  params: MaybeRefDeep<Partial<api.GetConeGeojsonById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-cone', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getConeGeojsonById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useSpatialCoveragesGeojson(
  searchParams: MaybeRefDeep<Partial<api.GetSpatialCoveragesGeojson.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-spatial-coverage', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getSpatialCoveragesGeojson(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useSpatialCoverageGeojsonById(
  params: MaybeRefDeep<Partial<api.GetSpatialCoverageGeojsonById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-spatial-coverage', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getSpatialCoverageGeojsonById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useLinesPointsGeojson(
  searchParams: MaybeRefDeep<Partial<api.GetLinesPointsGeojson.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-lines-points', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getLinesPointsGeojson(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useLinesPointsGeojsonById(
  params: MaybeRefDeep<Partial<api.GetLinesPointsGeojsonById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-lines-points', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getLinesPointsGeojsonById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useStories(
  searchParams: MaybeRefDeep<Partial<api.GetStories.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('story', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getStories(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useStoryById(
  params: MaybeRefDeep<Partial<api.GetStoryById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('story', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getStoryById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useStorySlides(
  searchParams: MaybeRefDeep<Partial<api.GetStorySlides.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('story-slide', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getStorySlides(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useStorySlideById(
  params: MaybeRefDeep<Partial<api.GetStorySlideById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('story-slide', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getStorySlideById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useSkosCollections(
  searchParams: MaybeRefDeep<Partial<api.GetSkosCollections.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('skos-collection', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getSkosCollections(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useSkosCollectionById(
  params: MaybeRefDeep<Partial<api.GetSkosCollectionById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('skos-collection', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getSkosCollectionById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useSkosConcepts(
  searchParams: MaybeRefDeep<Partial<api.GetSkosConcepts.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('skos-concept', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getSkosConcepts(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useSkosConceptById(
  params: MaybeRefDeep<Partial<api.GetSkosConceptById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('skos-concept', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getSkosConceptById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useSkosConceptSchemes(
  searchParams: MaybeRefDeep<Partial<api.GetSkosConceptSchemes.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('skos-concept-scheme', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getSkosConceptSchemes(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useSkosConceptSchemeById(
  params: MaybeRefDeep<Partial<api.GetSkosConceptSchemeById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('skos-concept-scheme', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      // @ts-expect-error Upstream type error.
      return api.getSkosConceptSchemeById(assertParams(params, ['id']));
    },
    ...getQueryOptions(options),
  });
}

export function useAuthorsAutoComplete(
  searchParams: MaybeRefDeep<Partial<api.GetAuthorsAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-author', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getAuthorsAutoComplete(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useKeywordsAutoComplete(
  searchParams: MaybeRefDeep<Partial<api.GetKeywordsAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-keyword', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getKeywordsAutoComplete(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useRegionKeywordsAutoComplete(
  searchParams: MaybeRefDeep<Partial<api.GetRegionKeywordsAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-keyword-region', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getRegionKeywordsAutoComplete(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useEthnonymKeywordsAutoComplete(
  searchParams: MaybeRefDeep<Partial<api.GetEthnonymKeywordsAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-keyword-ethnonym', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getEthnonymKeywordsAutoComplete(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useKeywordKeywordsAutoComplete(
  searchParams: MaybeRefDeep<Partial<api.GetKeywordKeywordsAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-keyword-keyword', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getKeywordKeywordsAutoComplete(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useNameKeywordsAutoComplete(
  searchParams: MaybeRefDeep<Partial<api.GetNameKeywordsAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-keyword-name', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getNameKeywordsAutoComplete(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function usePlacesAutoComplete(
  searchParams: MaybeRefDeep<Partial<api.GetPlacesAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-place', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getPlacesAutoComplete(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function usePassagesAutoComplete(
  searchParams: MaybeRefDeep<Partial<api.GetPassagesAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-passage', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getPassagesAutoComplete(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useTextsAutoComplete(
  searchParams: MaybeRefDeep<Partial<api.GetTextsAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-text', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getTextsAutoComplete(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useCaseStudiesAutoComplete(
  searchParams: MaybeRefDeep<Partial<api.GetCaseStudiesAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-case-study', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getCaseStudiesAutoComplete(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useTextGenreTypesAutoComplete(
  searchParams: MaybeRefDeep<Partial<api.GetTextGenreTypesAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-text-genre-type', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getTextGenreTypesAutoComplete(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function usePlaceTypesAutoComplete(
  searchParams: MaybeRefDeep<Partial<api.GetPlaceTypesAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-place-type', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getPlaceTypesAutoComplete(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function usePlaceCategoriesAutoComplete(
  searchParams: MaybeRefDeep<Partial<api.GetPlaceCategoriesAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-place-category', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getPlaceCategoriesAutoComplete(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useAutoComplete(
  searchParams: MaybeRefDeep<Partial<api.GetAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      // @ts-expect-error Upstream type error.
      return api.getAutoComplete(searchParams);
    },
    ...getQueryOptions(options),
  });
}

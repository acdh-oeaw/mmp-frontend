/* eslint @typescript-eslint/no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

import { assert } from '@stefanprobst/assert';
import type { UseQueryOptions } from '@tanstack/vue-query';
import { useQuery } from '@tanstack/vue-query';
import type { Ref } from 'vue';

import * as api from '@/api/client';

type MaybeRef<T> = T | Ref<T>;

type Options = {
  isEnabled?: UseQueryOptions['enabled'];
  keepPreviousData?: UseQueryOptions['keepPreviousData'];
};

const resources = [
  'author',
  'autocomplete-author',
  'autocomplete-keyword',
  'autocomplete-keyword-region',
  'autocomplete-keyword-ethnonym',
  'autocomplete-keyword-keyword',
  'autocomplete-keyword-name',
  'autocomplete-place',
  'autocomplete-passage',
  'autocomplete-text',
  'autocomplete-usecase',
  'autocomplete-text-genre-type',
  'autocomplete-place-type',
  'autocomplete-place-category',
  'event',
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
  'use-case',
] as const;

const scopes = ['list', 'by-id'] as const;

function createKey<
  TResource extends typeof resources[number],
  TScope extends typeof scopes[number],
  TArgs extends Array<MaybeRef<unknown>>
>(resource: TResource, scope: TScope, ...args: TArgs) {
  return [resource, scope, ...args] as const;
}

function assertId<T extends { id?: string | number | null }>(params: T) {
  const id = params.id;
  assert(id, 'ID is required.');
  return { ...params, id };
}

export function useAuthors(
  searchParams: MaybeRef<Partial<api.GetAuthors.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('author', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getAuthors(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useAuthorById(
  params: MaybeRef<Partial<api.GetAuthorById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('author', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getAuthorById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useKeywords(
  searchParams: MaybeRef<Partial<api.GetKeywords.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('keyword', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getKeywords(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useKeywordById(
  params: MaybeRef<Partial<api.GetKeywordById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('keyword', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getKeywordById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useKeywordByCenturyById(
  params: MaybeRef<Partial<api.GetKeywordById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('keyword', 'by-id', params, 'century'),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getKeywordByCenturyById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useKeywordGraph(
  searchParams: MaybeRef<Partial<api.GetKeywordGraph.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('keyword', 'list', searchParams, 'graph'),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getKeywordGraph(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function usePassages(
  searchParams: MaybeRef<Partial<api.GetPassages.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('passage', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getPassages(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function usePassageById(
  params: MaybeRef<Partial<api.GetPassageById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('passage', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getPassageById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function usePassageKeywords(
  searchParams: MaybeRef<Partial<api.GetPassageKeywords.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('passage', 'list', searchParams, 'keywords'),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getPassageKeywords(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function usePassageNlpData(
  searchParams: MaybeRef<Partial<api.GetPassageNlpData.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('passage', 'list', searchParams, 'nlp-data'),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getPassageNlpData(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function usePlaces(
  searchParams: MaybeRef<Partial<api.GetPlaces.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('place', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getPlaces(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function usePlaceById(
  params: MaybeRef<Partial<api.GetPlaceById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('place', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getPlaceById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useTexts(
  searchParams: MaybeRef<Partial<api.GetTexts.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('text', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getTexts(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useTextById(
  params: MaybeRef<Partial<api.GetTextById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('text', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getTextById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useUseCases(
  searchParams: MaybeRef<Partial<api.GetUseCases.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('use-case', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getUseCases(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useUseCaseById(
  params: MaybeRef<Partial<api.GetUseCaseById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('use-case', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getUseCaseById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useUseCaseTimeTableById(
  params: MaybeRef<Partial<api.GetSkosConceptSchemeById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('use-case', 'by-id', params, 'timetable'),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getUseCaseTimetableById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useEvents(
  searchParams: MaybeRef<Partial<api.GetEvents.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('event', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getEvents(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useEventById(
  params: MaybeRef<Partial<api.GetEventById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('event', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getEventById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useModelingProcesses(
  searchParams: MaybeRef<Partial<api.GetModelingProcesses.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('modeling-process', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getModelingProcesses(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useModelingProcessById(
  params: MaybeRef<Partial<api.GetModelingProcessById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('modeling-process', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getModelingProcessById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useStopWords(
  searchParams: MaybeRef<Partial<api.GetStopWords.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('stop-word', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getStopWords(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useTextTopicRelations(
  searchParams: MaybeRef<Partial<api.GetTextTopicRelations.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('text-topic-relation', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getTextTopicRelations(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useTextTopicRelationById(
  params: MaybeRef<Partial<api.GetTextTopicRelationById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('text-topic-relation', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getTextTopicRelationById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useTopics(
  searchParams: MaybeRef<Partial<api.GetTopics.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('topic', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getTopics(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useTopicById(
  params: MaybeRef<Partial<api.GetTopicById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('topic', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getTopicById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function usePlacesGeojson(
  searchParams: MaybeRef<Partial<api.GetPlacesGeojson.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-place', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getPlacesGeojson(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function usePlaceGeojsonById(
  params: MaybeRef<Partial<api.GetPlaceGeojsonById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-place', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getPlaceGeojsonById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useFuzzyPlacesGeojson(
  searchParams: MaybeRef<Partial<api.GetFuzzyPlacesGeojson.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-fuzzy-place', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getFuzzyPlacesGeojson(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useFuzzyPlaceGeojsonById(
  params: MaybeRef<Partial<api.GetFuzzyPlaceGeojsonById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-fuzzy-place', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getFuzzyPlaceGeojsonById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useConesGeojson(
  searchParams: MaybeRef<Partial<api.GetConesGeojson.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-cone', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getConesGeojson(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useConeGeojsonById(
  params: MaybeRef<Partial<api.GetConeGeojsonById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-cone', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getConeGeojsonById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useSpatialCoveragesGeojson(
  searchParams: MaybeRef<Partial<api.GetSpatialCoveragesGeojson.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-spatial-coverage', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getSpatialCoveragesGeojson(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useSpatialCoverageGeojsonById(
  params: MaybeRef<Partial<api.GetSpatialCoverageGeojsonById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-spatial-coverage', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getSpatialCoverageGeojsonById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useLinesPointsGeojson(
  searchParams: MaybeRef<Partial<api.GetLinesPointsGeojson.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-lines-points', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getLinesPointsGeojson(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useLinesPointsGeojsonById(
  params: MaybeRef<Partial<api.GetLinesPointsGeojsonById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-lines-points', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getLinesPointsGeojsonById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useStories(
  searchParams: MaybeRef<Partial<api.GetStories.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('story', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getStories(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useStoryById(
  params: MaybeRef<Partial<api.GetStoryById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('story', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getStoryById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useStorySlides(
  searchParams: MaybeRef<Partial<api.GetStorySlides.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('story-slide', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getStorySlides(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useStorySlideById(
  params: MaybeRef<Partial<api.GetStorySlideById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('story-slide', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getStorySlideById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useSkosCollections(
  searchParams: MaybeRef<Partial<api.GetSkosCollections.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('skos-collection', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getSkosCollections(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useSkosCollectionById(
  params: MaybeRef<Partial<api.GetSkosCollectionById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('skos-collection', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getSkosCollectionById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useSkosConcepts(
  searchParams: MaybeRef<Partial<api.GetSkosConcepts.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('skos-concept', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getSkosConcepts(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useSkosConceptById(
  params: MaybeRef<Partial<api.GetSkosConceptById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('skos-concept', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getSkosConceptById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useSkosConceptSchemes(
  searchParams: MaybeRef<Partial<api.GetSkosConceptSchemes.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('skos-concept-scheme', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getSkosConceptSchemes(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useSkosConceptSchemeById(
  params: MaybeRef<Partial<api.GetSkosConceptSchemeById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('skos-concept-scheme', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getSkosConceptSchemeById(assertId(params));
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useAuthorsAutoComplete(
  searchParams: MaybeRef<Partial<api.GetAuthorsAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-author', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getAuthorsAutoComplete(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useKeywordsAutoComplete(
  searchParams: MaybeRef<Partial<api.GetKeywordsAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-keyword', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getKeywordsAutoComplete(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useRegionKeywordsAutoComplete(
  searchParams: MaybeRef<Partial<api.GetRegionKeywordsAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-keyword-region', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getRegionKeywordsAutoComplete(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useEthnonymKeywordsAutoComplete(
  searchParams: MaybeRef<Partial<api.GetEthnonymKeywordsAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-keyword-ethnonym', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getEthnonymKeywordsAutoComplete(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useKeywordKeywordsAutoComplete(
  searchParams: MaybeRef<Partial<api.GetKeywordKeywordsAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-keyword-keyword', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getKeywordKeywordsAutoComplete(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useNameKeywordsAutoComplete(
  searchParams: MaybeRef<Partial<api.GetNameKeywordsAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-keyword-name', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getNameKeywordsAutoComplete(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function usePlacesAutoComplete(
  searchParams: MaybeRef<Partial<api.GetPlacesAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-place', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getPlacesAutoComplete(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function usePassagesAutoComplete(
  searchParams: MaybeRef<Partial<api.GetPassagesAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-passage', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getPassagesAutoComplete(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useTextsAutoComplete(
  searchParams: MaybeRef<Partial<api.GetTextsAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-text', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getTextsAutoComplete(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useUseCasesAutoComplete(
  searchParams: MaybeRef<Partial<api.GetUseCasesAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-usecase', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getUseCasesAutoComplete(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function useTextGenreTypesAutoComplete(
  searchParams: MaybeRef<Partial<api.GetTextGenreTypesAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-text-genre-type', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getTextGenreTypesAutoComplete(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function usePlaceTypesAutoComplete(
  searchParams: MaybeRef<Partial<api.GetPlaceTypesAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-place-type', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getPlaceTypesAutoComplete(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

export function usePlaceCategoriesAutoComplete(
  searchParams: MaybeRef<Partial<api.GetPlaceCategoriesAutoComplete.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('autocomplete-place-category', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getPlaceCategoriesAutoComplete(searchParams);
    },
    enabled: options?.isEnabled,
    keepPreviousData: options?.keepPreviousData,
  });
}

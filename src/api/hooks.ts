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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
  });
}

export function useGeojsonLayers(
  searchParams: MaybeRef<Partial<api.GetGeojsonLayers.SearchParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-layer', 'list', searchParams),
    queryFn: ({ queryKey: [, , searchParams] }) => {
      return api.getGeojsonLayers(searchParams);
    },
    ...getQueryOptions(options),
  });
}

export function useGeojsonLayerById(
  params: MaybeRef<Partial<api.GetGeojsonLayerById.PathParams>>,
  options?: Options
) {
  return useQuery({
    queryKey: createKey('geojson-layer', 'by-id', params),
    queryFn: ({ queryKey: [, , params] }) => {
      return api.getGeojsonLayerById(assertId(params));
    },
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
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
    ...getQueryOptions(options),
  });
}

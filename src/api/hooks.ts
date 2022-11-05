/* eslint @typescript-eslint/no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

import { useQuery } from '@tanstack/vue-query';
import type { Ref } from 'vue';
import { unref } from 'vue';

import * as api from '@/api/client';

type MaybeRef<T> = T | Ref<T>;

const resources = [
  'author',
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

export function useAuthors(searchParams: MaybeRef<api.GetAuthors.SearchParams>) {
  return useQuery({
    queryKey: createKey('author', 'list', searchParams),
    queryFn: () => api.getAuthors(unref(searchParams)),
  });
}

export function useAuthorById(params: MaybeRef<api.GetAuthorById.PathParams>) {
  return useQuery({
    queryKey: createKey('author', 'by-id', params),
    queryFn: () => api.getAuthorById(unref(params)),
  });
}

export function useKeywords(searchParams: MaybeRef<api.GetKeywords.SearchParams>) {
  return useQuery({
    queryKey: createKey('keyword', 'list', searchParams),
    queryFn: () => api.getKeywords(unref(searchParams)),
  });
}

export function useKeywordById(params: MaybeRef<api.GetKeywordById.PathParams>) {
  return useQuery({
    queryKey: createKey('keyword', 'by-id', params),
    queryFn: () => api.getKeywordById(unref(params)),
  });
}

export function useKeywordByCenturyById(params: MaybeRef<api.GetKeywordById.PathParams>) {
  return useQuery({
    queryKey: createKey('keyword', 'by-id', params, 'century'),
    queryFn: () => api.getKeywordByCenturyById(unref(params)),
  });
}

export function useKeywordGraph(searchParams: MaybeRef<api.GetKeywordGraph.SearchParams>) {
  return useQuery({
    queryKey: createKey('keyword', 'list', searchParams, 'graph'),
    queryFn: () => api.getKeywordGraph(unref(searchParams)),
  });
}

export function usePassages(searchParams: MaybeRef<api.GetPassages.SearchParams>) {
  return useQuery({
    queryKey: createKey('passage', 'list', searchParams),
    queryFn: () => api.getPassages(unref(searchParams)),
  });
}

export function usePassageById(params: MaybeRef<api.GetPassageById.PathParams>) {
  return useQuery({
    queryKey: createKey('passage', 'by-id', params),
    queryFn: () => api.getPassageById(unref(params)),
  });
}

export function usePassageKeywords(searchParams: MaybeRef<api.GetPassageKeywords.SearchParams>) {
  return useQuery({
    queryKey: createKey('passage', 'list', searchParams, 'keywords'),
    queryFn: () => api.getPassageKeywords(unref(searchParams)),
  });
}

export function usePassageNlpData(searchParams: MaybeRef<api.GetPassageNlpData.SearchParams>) {
  return useQuery({
    queryKey: createKey('passage', 'list', searchParams, 'nlp-data'),
    queryFn: () => api.getPassageNlpData(unref(searchParams)),
  });
}

export function usePlaces(searchParams: MaybeRef<api.GetPlaces.SearchParams>) {
  return useQuery({
    queryKey: createKey('place', 'list', searchParams),
    queryFn: () => api.getPlaces(unref(searchParams)),
  });
}

export function usePlaceById(params: MaybeRef<api.GetPlaceById.PathParams>) {
  return useQuery({
    queryKey: createKey('place', 'by-id', params),
    queryFn: () => api.getPlaceById(unref(params)),
  });
}

export function useTexts(searchParams: MaybeRef<api.GetTexts.SearchParams>) {
  return useQuery({
    queryKey: createKey('text', 'list', searchParams),
    queryFn: () => api.getTexts(unref(searchParams)),
  });
}

export function useTextById(params: MaybeRef<api.GetTextById.PathParams>) {
  return useQuery({
    queryKey: createKey('text', 'by-id', params),
    queryFn: () => api.getTextById(unref(params)),
  });
}

export function useUseCases(searchParams: MaybeRef<api.GetUseCases.SearchParams>) {
  return useQuery({
    queryKey: createKey('use-case', 'list', searchParams),
    queryFn: () => api.getUseCases(unref(searchParams)),
  });
}

export function useUseCaseById(params: MaybeRef<api.GetUseCaseById.PathParams>) {
  return useQuery({
    queryKey: createKey('use-case', 'by-id', params),
    queryFn: () => api.getUseCaseById(unref(params)),
  });
}

export function useUseCaseTimeTableById(params: MaybeRef<api.GetSkosConceptSchemeById.PathParams>) {
  return useQuery({
    queryKey: createKey('use-case', 'by-id', params, 'timetable'),
    queryFn: () => api.getUseCaseTimetableById(unref(params)),
  });
}

export function useModelingProcesses(
  searchParams: MaybeRef<api.GetModelingProcesses.SearchParams>
) {
  return useQuery({
    queryKey: createKey('modeling-process', 'list', searchParams),
    queryFn: () => api.getModelingProcesses(unref(searchParams)),
  });
}

export function useModelingProcessById(params: MaybeRef<api.GetModelingProcessById.PathParams>) {
  return useQuery({
    queryKey: createKey('modeling-process', 'by-id', params),
    queryFn: () => api.getModelingProcessById(unref(params)),
  });
}

export function useStopWords() {
  return useQuery({
    queryKey: createKey('stop-word', 'list'),
    queryFn: () => api.getStopWords(),
  });
}

export function useTextTopicRelations(
  searchParams: MaybeRef<api.GetTextTopicRelations.SearchParams>
) {
  return useQuery({
    queryKey: createKey('text-topic-relation', 'list', searchParams),
    queryFn: () => api.getTextTopicRelations(unref(searchParams)),
  });
}

export function useTextTopicRelationById(
  params: MaybeRef<api.GetTextTopicRelationById.PathParams>
) {
  return useQuery({
    queryKey: createKey('text-topic-relation', 'by-id', params),
    queryFn: () => api.getTextTopicRelationById(unref(params)),
  });
}

export function useTopics(searchParams: MaybeRef<api.GetTopics.SearchParams>) {
  return useQuery({
    queryKey: createKey('topic', 'list', searchParams),
    queryFn: () => api.getTopics(unref(searchParams)),
  });
}

export function useTopicById(params: MaybeRef<api.GetTopicById.PathParams>) {
  return useQuery({
    queryKey: createKey('topic', 'by-id', params),
    queryFn: () => api.getTopicById(unref(params)),
  });
}

export function usePlacesGeojson(searchParams: MaybeRef<api.GetPlacesGeojson.SearchParams>) {
  return useQuery({
    queryKey: createKey('geojson-place', 'list', searchParams),
    queryFn: () => api.getPlacesGeojson(unref(searchParams)),
  });
}

export function usePlaceGeojsonById(params: MaybeRef<api.GetPlaceGeojsonById.PathParams>) {
  return useQuery({
    queryKey: createKey('geojson-place', 'by-id', params),
    queryFn: () => api.getPlaceGeojsonById(unref(params)),
  });
}

export function useFuzzyPlacesGeojson(
  searchParams: MaybeRef<api.GetFuzzyPlacesGeojson.SearchParams>
) {
  return useQuery({
    queryKey: createKey('geojson-fuzzy-place', 'list', searchParams),
    queryFn: () => api.getFuzzyPlacesGeojson(unref(searchParams)),
  });
}

export function useFuzzyPlaceGeojsonById(
  params: MaybeRef<api.GetFuzzyPlaceGeojsonById.PathParams>
) {
  return useQuery({
    queryKey: createKey('geojson-fuzzy-place', 'by-id', params),
    queryFn: () => api.getFuzzyPlaceGeojsonById(unref(params)),
  });
}

export function useConesGeojson(searchParams: MaybeRef<api.GetConesGeojson.SearchParams>) {
  return useQuery({
    queryKey: createKey('geojson-cone', 'list', searchParams),
    queryFn: () => api.getConesGeojson(unref(searchParams)),
  });
}

export function useConeGeojsonById(params: MaybeRef<api.GetConeGeojsonById.PathParams>) {
  return useQuery({
    queryKey: createKey('geojson-cone', 'by-id', params),
    queryFn: () => api.getConeGeojsonById(unref(params)),
  });
}

export function useSpatialCoveragesGeojson(
  searchParams: MaybeRef<api.GetSpatialCoveragesGeojson.SearchParams>
) {
  return useQuery({
    queryKey: createKey('geojson-spatial-coverage', 'list', searchParams),
    queryFn: () => api.getSpatialCoveragesGeojson(unref(searchParams)),
  });
}

export function useSpatialCoverageGeojsonById(
  params: MaybeRef<api.GetSpatialCoverageGeojsonById.PathParams>
) {
  return useQuery({
    queryKey: createKey('geojson-spatial-coverage', 'by-id', params),
    queryFn: () => api.getSpatialCoverageGeojsonById(unref(params)),
  });
}

export function useLinesPointsGeojson(
  searchParams: MaybeRef<api.GetLinesPointsGeojson.SearchParams>
) {
  return useQuery({
    queryKey: createKey('geojson-lines-points', 'list', searchParams),
    queryFn: () => api.getLinesPointsGeojson(unref(searchParams)),
  });
}

export function useLinesPointsGeojsonById(
  params: MaybeRef<api.GetLinesPointsGeojsonById.PathParams>
) {
  return useQuery({
    queryKey: createKey('geojson-lines-points', 'by-id', params),
    queryFn: () => api.getLinesPointsGeojsonById(unref(params)),
  });
}

export function useStories(searchParams: MaybeRef<api.GetStories.SearchParams>) {
  return useQuery({
    queryKey: createKey('story', 'list', searchParams),
    queryFn: () => api.getStories(unref(searchParams)),
  });
}

export function useStoryById(params: MaybeRef<api.GetStoryById.PathParams>) {
  return useQuery({
    queryKey: createKey('story', 'by-id', params),
    queryFn: () => api.getStoryById(unref(params)),
  });
}

export function useStorySlides(searchParams: MaybeRef<api.GetStorySlides.SearchParams>) {
  return useQuery({
    queryKey: createKey('story-slide', 'list', searchParams),
    queryFn: () => api.getStorySlides(unref(searchParams)),
  });
}

export function useStorySlideById(params: MaybeRef<api.GetStorySlideById.PathParams>) {
  return useQuery({
    queryKey: createKey('story-slide', 'by-id', params),
    queryFn: () => api.getStorySlideById(unref(params)),
  });
}

export function useSkosCollections(searchParams: MaybeRef<api.GetSkosCollections.SearchParams>) {
  return useQuery({
    queryKey: createKey('skos-collection', 'list', searchParams),
    queryFn: () => api.getSkosCollections(unref(searchParams)),
  });
}

export function useSkosCollectionById(params: MaybeRef<api.GetSkosCollectionById.PathParams>) {
  return useQuery({
    queryKey: createKey('skos-collection', 'by-id', params),
    queryFn: () => api.getSkosCollectionById(unref(params)),
  });
}

export function useSkosConcepts(searchParams: MaybeRef<api.GetSkosConcepts.SearchParams>) {
  return useQuery({
    queryKey: createKey('skos-concept', 'list', searchParams),
    queryFn: () => api.getSkosConcepts(unref(searchParams)),
  });
}

export function useSkosConceptById(params: MaybeRef<api.GetSkosConceptById.PathParams>) {
  return useQuery({
    queryKey: createKey('skos-concept', 'by-id', params),
    queryFn: () => api.getSkosConceptById(unref(params)),
  });
}

export function useSkosConceptSchemes(
  searchParams: MaybeRef<api.GetSkosConceptSchemes.SearchParams>
) {
  return useQuery({
    queryKey: createKey('skos-concept-scheme', 'list', searchParams),
    queryFn: () => api.getSkosConceptSchemes(unref(searchParams)),
  });
}

export function useSkosConceptSchemeById(
  params: MaybeRef<api.GetSkosConceptSchemeById.PathParams>
) {
  return useQuery({
    queryKey: createKey('skos-concept-scheme', 'by-id', params),
    queryFn: () => api.getSkosConceptSchemeById(unref(params)),
  });
}

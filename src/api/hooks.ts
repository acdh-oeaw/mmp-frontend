/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint @typescript-eslint/no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

import { useQuery } from '@tanstack/vue-query';

import * as api from '@/api/client';

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
  TArgs extends unknown[]
>(resource: TResource, scope: TScope, ...args: TArgs) {
  return [resource, scope, ...args] as const;
}

export function useAuthors(searchParams: api.GetAuthors.SearchParams) {
  return useQuery({
    queryKey: createKey('author', 'list', searchParams),
    queryFn: () => api.getAuthors(searchParams),
  });
}

export function useAuthorById(params: api.GetAuthorById.PathParams) {
  return useQuery({
    queryKey: createKey('author', 'by-id', params),
    queryFn: () => api.getAuthorById(params),
  });
}

export function useKeywords(searchParams: api.GetKeywords.SearchParams) {
  return useQuery({
    queryKey: createKey('keyword', 'list', searchParams),
    queryFn: () => api.getKeywords(searchParams),
  });
}

export function useKeywordById(params: api.GetKeywordById.PathParams) {
  return useQuery({
    queryKey: createKey('keyword', 'by-id', params),
    queryFn: () => api.getKeywordById(params),
  });
}

export function useKeywordByCenturyById(params: api.GetKeywordById.PathParams) {
  return useQuery({
    queryKey: createKey('keyword', 'by-id', params, 'century'),
    queryFn: () => api.getKeywordByCenturyById(params),
  });
}

export function useKeywordGraph(searchParams: api.GetKeywordGraph.SearchParams) {
  return useQuery({
    queryKey: createKey('keyword', 'list', searchParams, 'graph'),
    queryFn: () => api.getKeywordGraph(searchParams),
  });
}

export function usePassages(searchParams: api.GetPassages.SearchParams) {
  return useQuery({
    queryKey: createKey('passage', 'list', searchParams),
    queryFn: () => api.getPassages(searchParams),
  });
}

export function usePassageById(params: api.GetPassageById.PathParams) {
  return useQuery({
    queryKey: createKey('passage', 'by-id', params),
    queryFn: () => api.getPassageById(params),
  });
}

export function usePassageKeywords(searchParams: api.GetPassageKeywords.SearchParams) {
  return useQuery({
    queryKey: createKey('passage', 'list', searchParams, 'keywords'),
    queryFn: () => api.getPassageKeywords(searchParams),
  });
}

export function usePassageNlpData(searchParams: api.GetPassageNlpData.SearchParams) {
  return useQuery({
    queryKey: createKey('passage', 'list', searchParams, 'nlp-data'),
    queryFn: () => api.getPassageNlpData(searchParams),
  });
}

export function usePlaces(searchParams: api.GetPlaces.SearchParams) {
  return useQuery({
    queryKey: createKey('place', 'list', searchParams),
    queryFn: () => api.getPlaces(searchParams),
  });
}

export function usePlaceById(params: api.GetPlaceById.PathParams) {
  return useQuery({
    queryKey: createKey('place', 'by-id', params),
    queryFn: () => api.getPlaceById(params),
  });
}

export function useTexts(searchParams: api.GetTexts.SearchParams) {
  return useQuery({
    queryKey: createKey('text', 'list', searchParams),
    queryFn: () => api.getTexts(searchParams),
  });
}

export function useTextById(params: api.GetTextById.PathParams) {
  return useQuery({
    queryKey: createKey('text', 'by-id', params),
    queryFn: () => api.getTextById(params),
  });
}

export function useUseCases(searchParams: api.GetUseCases.SearchParams) {
  return useQuery({
    queryKey: createKey('use-case', 'list', searchParams),
    queryFn: () => api.getUseCases(searchParams),
  });
}

export function useUseCaseById(params: api.GetUseCaseById.PathParams) {
  return useQuery({
    queryKey: createKey('use-case', 'by-id', params),
    queryFn: () => api.getUseCaseById(params),
  });
}

export function useUseCaseTimeTableById(params: api.GetSkosConceptSchemeById.PathParams) {
  return useQuery({
    queryKey: createKey('use-case', 'by-id', params, 'timetable'),
    queryFn: () => api.getUseCaseTimetableById(params),
  });
}

export function useModelingProcesses(searchParams: api.GetModelingProcesses.SearchParams) {
  return useQuery({
    queryKey: createKey('modeling-process', 'list', searchParams),
    queryFn: () => api.getModelingProcesses(searchParams),
  });
}

export function useModelingProcessById(params: api.GetModelingProcessById.PathParams) {
  return useQuery({
    queryKey: createKey('modeling-process', 'by-id', params),
    queryFn: () => api.getModelingProcessById(params),
  });
}

export function useStopWords() {
  return useQuery({
    queryKey: createKey('stop-word', 'list'),
    queryFn: () => api.getStopWords(),
  });
}

export function useTextTopicRelations(searchParams: api.GetTextTopicRelations.SearchParams) {
  return useQuery({
    queryKey: createKey('text-topic-relation', 'list', searchParams),
    queryFn: () => api.getTextTopicRelations(searchParams),
  });
}

export function useTextTopicRelationById(params: api.GetTextTopicRelationById.PathParams) {
  return useQuery({
    queryKey: createKey('text-topic-relation', 'by-id', params),
    queryFn: () => api.getTextTopicRelationById(params),
  });
}

export function useTopics(searchParams: api.GetTopics.SearchParams) {
  return useQuery({
    queryKey: createKey('topic', 'list', searchParams),
    queryFn: () => api.getTopics(searchParams),
  });
}

export function useTopicById(params: api.GetTopicById.PathParams) {
  return useQuery({
    queryKey: createKey('topic', 'by-id', params),
    queryFn: () => api.getTopicById(params),
  });
}

export function usePlacesGeojson(searchParams: api.GetPlacesGeojson.SearchParams) {
  return useQuery({
    queryKey: createKey('geojson-place', 'list', searchParams),
    queryFn: () => api.getPlacesGeojson(searchParams),
  });
}

export function usePlaceGeojsonById(params: api.GetPlaceGeojsonById.PathParams) {
  return useQuery({
    queryKey: createKey('geojson-place', 'by-id', params),
    queryFn: () => api.getPlaceGeojsonById(params),
  });
}

export function useFuzzyPlacesGeojson(searchParams: api.GetFuzzyPlacesGeojson.SearchParams) {
  return useQuery({
    queryKey: createKey('geojson-fuzzy-place', 'list', searchParams),
    queryFn: () => api.getFuzzyPlacesGeojson(searchParams),
  });
}

export function useFuzzyPlaceGeojsonById(params: api.GetFuzzyPlaceGeojsonById.PathParams) {
  return useQuery({
    queryKey: createKey('geojson-fuzzy-place', 'by-id', params),
    queryFn: () => api.getFuzzyPlaceGeojsonById(params),
  });
}

export function useConesGeojson(searchParams: api.GetConesGeojson.SearchParams) {
  return useQuery({
    queryKey: createKey('geojson-cone', 'list', searchParams),
    queryFn: () => api.getConesGeojson(searchParams),
  });
}

export function useConeGeojsonById(params: api.GetConeGeojsonById.PathParams) {
  return useQuery({
    queryKey: createKey('geojson-cone', 'by-id', params),
    queryFn: () => api.getConeGeojsonById(params),
  });
}

export function useSpatialCoveragesGeojson(
  searchParams: api.GetSpatialCoveragesGeojson.SearchParams
) {
  return useQuery({
    queryKey: createKey('geojson-spatial-coverage', 'list', searchParams),
    queryFn: () => api.getSpatialCoveragesGeojson(searchParams),
  });
}

export function useSpatialCoverageGeojsonById(
  params: api.GetSpatialCoverageGeojsonById.PathParams
) {
  return useQuery({
    queryKey: createKey('geojson-spatial-coverage', 'by-id', params),
    queryFn: () => api.getSpatialCoverageGeojsonById(params),
  });
}

export function useLinesPointsGeojson(searchParams: api.GetLinesPointsGeojson.SearchParams) {
  return useQuery({
    queryKey: createKey('geojson-lines-points', 'list', searchParams),
    queryFn: () => api.getLinesPointsGeojson(searchParams),
  });
}

export function useLinesPointsGeojsonById(params: api.GetLinesPointsGeojsonById.PathParams) {
  return useQuery({
    queryKey: createKey('geojson-lines-points', 'by-id', params),
    queryFn: () => api.getLinesPointsGeojsonById(params),
  });
}

export function useStories(searchParams: api.GetStories.SearchParams) {
  return useQuery({
    queryKey: createKey('story', 'list', searchParams),
    queryFn: () => api.getStories(searchParams),
  });
}

export function useStoryById(params: api.GetStoryById.PathParams) {
  return useQuery({
    queryKey: createKey('story', 'by-id', params),
    queryFn: () => api.getStoryById(params),
  });
}

export function useStorySlides(searchParams: api.GetStorySlides.SearchParams) {
  return useQuery({
    queryKey: createKey('story-slide', 'list', searchParams),
    queryFn: () => api.getStorySlides(searchParams),
  });
}

export function useStorySlideById(params: api.GetStorySlideById.PathParams) {
  return useQuery({
    queryKey: createKey('story-slide', 'by-id', params),
    queryFn: () => api.getStorySlideById(params),
  });
}

export function useSkosCollections(searchParams: api.GetSkosCollections.SearchParams) {
  return useQuery({
    queryKey: createKey('skos-collection', 'list', searchParams),
    queryFn: () => api.getSkosCollections(searchParams),
  });
}

export function useSkosCollectionById(params: api.GetSkosCollectionById.PathParams) {
  return useQuery({
    queryKey: createKey('skos-collection', 'by-id', params),
    queryFn: () => api.getSkosCollectionById(params),
  });
}

export function useSkosConcepts(searchParams: api.GetSkosConcepts.SearchParams) {
  return useQuery({
    queryKey: createKey('skos-concept', 'list', searchParams),
    queryFn: () => api.getSkosConcepts(searchParams),
  });
}

export function useSkosConceptById(params: api.GetSkosConceptById.PathParams) {
  return useQuery({
    queryKey: createKey('skos-concept', 'by-id', params),
    queryFn: () => api.getSkosConceptById(params),
  });
}

export function useSkosConceptSchemes(searchParams: api.GetSkosConceptSchemes.SearchParams) {
  return useQuery({
    queryKey: createKey('skos-concept-scheme', 'list', searchParams),
    queryFn: () => api.getSkosConceptSchemes(searchParams),
  });
}

export function useSkosConceptSchemeById(params: api.GetSkosConceptSchemeById.PathParams) {
  return useQuery({
    queryKey: createKey('skos-concept-scheme', 'by-id', params),
    queryFn: () => api.getSkosConceptSchemeById(params),
  });
}

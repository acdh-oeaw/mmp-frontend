/* eslint-disable @typescript-eslint/no-namespace */

import type { RequestOptions } from '@stefanprobst/request';
import { createUrl, request } from '@stefanprobst/request';
import type { Feature, Point, Polygon } from 'geojson';
import useRequest from 'swrv';
import type { IConfig, IResponse } from 'swrv/dist/types';

/**
 * MMP API
 * docs: {@link https://mmp.acdh-dev.oeaw.ac.at/api-docs/}
 */

const baseUrl = 'https://mmp.acdh-dev.oeaw.ac.at/api/';
const options: RequestOptions = { responseType: 'json' };
const defaults: IConfig = { dedupingInterval: Infinity, revalidateOnFocus: false };

function createKey(url: URL) {
  url.searchParams.sort();
  return String(url);
}

type Config = {
  isDisabled?: boolean;
};

//

type PaginatedEntityRequest<T> = T & {
  limit?: number;
  offset?: number;
};

type PaginatedGeoJsonRequest<T> = T & {
  page?: number;
  page_size?: number;
};

type PaginationInfo = {
  count: number;
  next: string | null;
  previous: string | null;
};

type PaginatedEntityResponse<T> = PaginationInfo & {
  results: Array<T>;
};

type PaginatedGeoJsonResponse<T> = PaginationInfo & {
  type: 'FeatureCollection';
  features: Array<T>;
};

type PaginatedGeoJsonResponseAlternate<T> = PaginationInfo & {
  results: {
    type: 'FeatureCollection';
    features: Array<T>;
  };
};

//

type IsoDateString = string;

type UrlString = string;

export interface KeyWordRef {
  url: UrlString;
  // id: number;
  legacy_id: string;
  legacy_pk: number;
  stichwort: string;
  name_gr: string;
  art: string;
  varianten: string;
  wurzel: string;
  kommentar: null;
  orig_data_csv: string;
  related_keyword: Array<KeyWordRef['url']>;
}

export interface PlaceRef {
  id: number;
  name: string;
  lat: number;
  lng: number;
  art: { id: number; label: string };
}

export interface PersonRef {
  id: number;
  name: string;
  place: PlaceRef;
}

export interface TextRef {
  id: number;
  title: string;
  places: Array<PlaceRef>;
  authors: Array<PersonRef>;
}

export interface PassageRef {
  id: number;
  /** year */
  start_date: number | null;
  /** year */
  end_date: number | null;
  display_label: string;
}

interface SkosConcept {
  url: UrlString;
  pref_label: string;
  pref_label_lang: string;
  top_concept: null;
  notation: string;
  related: string;
  broad_match: string;
  narrow_match: string;
  exact_match: string;
  related_match: string;
  close_match: string;
  legacy_id: string;
  creator: string;
  contributor: string;
  needs_review: null;
  date_created: IsoDateString;
  date_modified: IsoDateString;
  lft: number;
  rght: number;
  tree_id: number;
  level: number;
  scheme: UrlString;
  broader_concept: null;
  created_by: null;
  collection: Array<UrlString>;
}

//

export type Cone = { id: number } & Feature<
  Polygon,
  {
    key_word: KeyWordRef;
    fuzzyness: number;
    stelle: Array<PassageRef>;
    texts: Array<TextRef>;
    places: Array<PlaceRef>;
  }
>;

export type PlaceGeoJson = { id: number } & Feature<
  Point,
  {
    name: string;
    name_antik: string;
    name_de: string;
    name_fr: string;
    name_gr: string;
    art: SkosConcept['url'] | null;
    kategorie: SkosConcept['url'] | null;
  }
>;

export type SpatialCoverage = { id: number; bbox: [number, number, number, number] } & Feature<
  Polygon,
  {
    show_labels: boolean;
    key_word: KeyWordRef;
    fuzzyness: number;
    stelle: Array<PassageRef>;
    texts: Array<TextRef>;
    places: Array<PlaceRef>;
  }
>;

export interface UseCase {
  url: UrlString;
  /**
   * Not included in api responses, added client side for `/api/usecase` only.
   */
  id?: number;
  title: string;
  principal_investigator: string;
  pi_norm_id: string;
  description: string;
  story_map: string;
  custom_layer: string | null;
  knightlab_stoy_map: [];
}

export interface Keyword {
  // id: number;
  url: UrlString;
  legacy_id: string;
  legacy_pk: number;
  stichwort: string;
  name_gr: string;
  art: string;
  varianten: string;
  wurzel: string;
  kommentar: string;
  orig_data_csv: string;
  related_keyword: Array<Keyword['url']>;
}

export interface Passage {
  url: UrlString;
  legacy_id: string;
  legacy_pk: number;
  summary: string;
  zitat: string;
  zitat_stelle: string;
  translation: string;
  start_date: number;
  end_date: number;
  kommentar: string;
  display_label: string;
  orig_data_csv: string;
  text: Text;
  key_word: Array<Keyword>;
  ort: Array<Place>;
  use_case: Array<UseCase>;
}

export interface Place {
  url: string;
  legacy_id: string;
  legacy_pk: number;
  name: string;
  norm_id: string;
  name_antik: string;
  name_de: string;
  name_fr: string;
  name_it: string;
  name_gr: string;
  long: number;
  lat: number;
  coords: Point;
  fuzzy_geom: null;
  kommentar: string;
  orig_data_csv: string;
  art: SkosConcept['url'];
  kategorie: SkosConcept['url'];
}

export interface Author {
  url: string;
  legacy_id: string;
  legacy_pk: 1;
  name: string;
  gnd_id: string;
  name_lat: string;
  name_en: string;
  name_fr: string;
  name_it: string;
  name_gr: string;
  jahrhundert: string;
  start_date: string;
  end_date: string;
  start_date_year: number;
  end_date_year: number;
  kommentar: string;
  orig_data_csv: string;
  ort: Place['url'];
}

export interface Text {
  url: UrlString;
  legacy_id: string;
  legacy_pk: number;
  title: string;
  alt_title: string;
  text_lang: string;
  jahrhundert: string;
  start_date: string;
  end_date: string;
  not_before: number;
  not_after: number;
  edition: string;
  kommentar: string;
  orig_data_csv: string;
  art: SkosConcept;
  author: Author;
  ort: Place;
}

//

export namespace GetCones {
  export type SearchParams = PaginatedGeoJsonRequest<{
    id?: Cone['id'];
    show_labels?: boolean;
    key_word?: Array<number>; // Array<KeyWordRef['id']>;
    stelle?: Array<number>;
    stelle__use_case?: Array<number>;
    stelle__ort?: Array<number>;
    stelle__text__ort?: Array<number>;
    stelle__start_date?: number;
    stelle__start_date_lookup?: 'gt' | 'lt';
    stelle__end_date?: number;
    stelle__end_date_lookup?: 'gt' | 'lt';
    stelle__text__not_before?: number;
    stelle__text__not_before_lookup?: 'gt' | 'lt';
    stelle__text__not_after?: number;
    stelle__text__not_after_lookup?: 'gt' | 'lt';
    stelle__text__autor?: Array<number>;
    stelle__text__autor__start_date_year?: number;
    stelle__text__autor__start_date_year_lookup?: 'gt' | 'lt';
    stelle__text__autor__end_date_year?: number;
    stelle__text__autor__end_date_year_lookup?: 'gt' | 'lt';
    ordering?: string;
  }>;
  export type Response = PaginatedGeoJsonResponse<Cone>;
}

export function useGetCones(
  searchParams?: GetCones.SearchParams,
  config?: Config
): IResponse<GetCones.Response> {
  const url = createUrl({ baseUrl, pathname: 'cones/', searchParams });

  return useRequest(
    config?.isDisabled ? null : createKey(url),
    () =>
      request(url, options)
        /**
         * We don't display cones without origin positions (which are the first text place related to the cone).
         * TODO: check if this is actually correct
         */
        .then((data: GetCones.Response) => {
          const features = data.features.filter((feature) =>
            feature.properties.texts.some((text) => text.places.length > 0)
          );
          return { ...data, features };
        }),
    defaults
  );
}

//

export namespace GetPlacesGeoJson {
  export type SearchParams = PaginatedEntityRequest<{
    ids?: Array<PlaceRef['id']>;
    id?: PlaceRef['id'];
    legacy_id?: string;
    legacy_pk?: number;
    name?: string;
    norm_id?: string;
    name_antik?: string;
    name_de?: string;
    name_fr?: string;
    name_it?: string;
    long?: number;
    lat?: number;
    art?: Array<number>;
    kategorie?: Array<number>;
    kommentar?: string;
    rvn_autor_ort_ort?: Array<number>;
    rvn_text_ort_ort?: Array<number>;
    rvn_text_ort_ort__rvn_stelle_text_text__key_word?: Array<number>;
    rvn_text_ort_ort__rvn_stelle_text_text__use_case?: Array<number>;
    rvn_text_ort_ort__rvn_stelle_text_text?: Array<number>;
    ordering?: string;
  }>;
  export type Response = PaginatedGeoJsonResponseAlternate<PlaceGeoJson>;
}

export function useGetPlacesGeoJson(
  searchParams?: GetPlacesGeoJson.SearchParams,
  config?: Config
): IResponse<GetPlacesGeoJson.Response> {
  const url = createUrl({ baseUrl, pathname: 'ort-geojson/', searchParams });

  return useRequest(
    config?.isDisabled ? null : createKey(url),
    () => request(url, options),
    defaults
  );
}

//

export namespace GetSpatialCoverages {
  export type SearchParams = PaginatedGeoJsonRequest<{
    id?: SpatialCoverage['id'];
    show_labels?: boolean;
    key_word?: Array<number>; // Array<KeyWordRef['id']>;
    stelle?: Array<number>;
    stelle__use_case?: Array<number>;
    stelle__ort?: Array<number>;
    stelle__text__ort?: Array<number>;
    stelle__start_date?: number;
    stelle__start_date_lookup?: 'gt' | 'lt';
    stelle__end_date?: number;
    stelle__end_date_lookup?: 'gt' | 'lt';
    stelle__text__not_before?: number;
    stelle__text__not_before_lookup?: 'gt' | 'lt';
    stelle__text__not_after?: number;
    stelle__text__not_after_lookup?: 'gt' | 'lt';
    stelle__text__autor?: Array<number>;
    stelle__text__autor__start_date_year?: number;
    stelle__text__autor__start_date_year_lookup?: 'gt' | 'lt';
    stelle__text__autor__end_date_year?: number;
    stelle__text__autor__end_date_year_lookup?: 'gt' | 'lt';
    ordering?: string;
  }>;
  export type Response = PaginatedGeoJsonResponse<SpatialCoverage>;
}

export function useGetSpatialCoverages(
  searchParams?: GetSpatialCoverages.SearchParams,
  config?: Config
): IResponse<GetSpatialCoverages.Response> {
  const url = createUrl({ baseUrl, pathname: 'spatialcoverage/', searchParams });

  return useRequest(
    config?.isDisabled ? null : createKey(url),
    () => request(url, options),
    defaults
  );
}

//

export namespace GetUseCases {
  export type SearchParams = PaginatedEntityRequest<{
    id?: UseCase['id'];
    ids?: Array<UseCase['id']>;
    title?: string;
    principal_investigator?: string;
    pi_norm_id?: string;
    description?: string;
    has_stelle__text?: Array<number>;
    has_stelle__text__autor?: Array<number>;
    has_stelle__key_word?: Array<number>;
    ordering?: string;
  }>;
  export type Response = PaginatedEntityResponse<UseCase>;
}

export function useGetUseCases(
  searchParams?: GetUseCases.SearchParams,
  config?: Config
): IResponse<GetUseCases.Response> {
  const url = createUrl({ baseUrl, pathname: 'usecase/', searchParams });

  return useRequest(
    config?.isDisabled ? null : createKey(url),
    () =>
      request(url, options)
        /**
         * Missing `id` in response.
         *
         * @see https://github.com/acdh-oeaw/mmp/issues/115
         */
        .then((data: GetUseCases.Response) => {
          const results = data.results.map((result) => {
            const id = Number(result.url.split('/').at(-2));
            return { ...result, id };
          });
          return { ...data, results };
        }),
    defaults
  );
}

export namespace GetUseCaseById {
  export type PathParams = {
    id: UseCase['id'];
  };
  export type SearchParams = {
    // TODO: unclear what any search params will do here
  };
  export type Response = UseCase;
}

export function useGetUseCaseById(
  params: GetUseCaseById.PathParams,
  searchParams?: GetUseCaseById.SearchParams,
  config?: Config
) {
  const url = createUrl({ baseUrl, pathname: `usecase/${params.id}`, searchParams });

  return useRequest(
    config?.isDisabled ? null : createKey(url),
    () =>
      request(url, options)
        /**
         * Missing `id` in response.
         *
         * @see https://github.com/acdh-oeaw/mmp/issues/115
         */
        .then((data: GetUseCaseById.Response) => {
          const id = Number(data.url.split('/').at(-2));
          return { ...data, id };
        }),
    defaults
  );
}

//

export namespace GetKeywords {
  export type SearchParams = PaginatedEntityRequest<{
    id?: string; // Keyword['id']
    ids?: Array<number>; // Array<Keyword['id']>
    legacy_id?: string;
    legacy_pk?: number;
    stichwort?: string;
    wurzel?: string;
    kommentar?: string;
    art?: Array<number>;
    /**
     * Allows multiple values separated by semicolon.
     */
    varianten?: string;
    has_usecase?: 'Yes';
    rvn_stelle_key_word_keyword__text__not_before?: string;
    rvn_stelle_key_word_keyword__text__not_after?: string;
    rvn_stelle_key_word_keyword?: Array<number>;
    rvn_stelle_key_word_keyword__text?: Array<number>;
    rvn_stelle_key_word_keyword__text__autor?: Array<number>;
    rvn_stelle_key_word_keyword__text__autor__ort?: Array<number>;
    rvn_stelle_key_word_keyword__text__autor__start_date_year?: number;
    rvn_stelle_key_word_keyword__text__autor__end_date_year?: number;
    rvn_stelle_key_word_keyword__start_date?: string;
    rvn_stelle_key_word_keyword__end_date?: string;
    rvn_stelle_key_word_keyword__use_case?: Array<number>;
    ordering?: string;
  }>;
  export type Response = PaginatedEntityResponse<Keyword>;
}

export function useGetKeywords(searchParams?: GetKeywords.SearchParams, config?: Config) {
  const url = createUrl({ baseUrl, pathname: 'keyword/', searchParams });

  return useRequest(
    config?.isDisabled ? null : createKey(url),
    () => request(url, options),
    defaults
  );
}

export namespace GetKeywordById {
  export type PathParams = {
    id: number; // Keyword['id'];
  };
  export type SearchParams = {
    // TODO: unclear what any search params will do here
  };
  export type Response = Keyword;
}

export function useGetKeywordById(
  params: GetKeywordById.PathParams,
  searchParams?: GetKeywordById.SearchParams,
  config?: Config
) {
  const url = createUrl({ baseUrl, pathname: `keyword/${params.id}`, searchParams });

  return useRequest(
    config?.isDisabled ? null : createKey(url),
    () => request(url, options),
    defaults
  );
}

//

export namespace GetPassages {
  export type SearchParams = PaginatedEntityRequest<{
    id?: number; // Passage['id']
    ids?: Array<number>; // Array<Passage['id']>
    legacy_id?: string;
    legacy_pk?: number;
    text?: string;
    summary?: string;
    zitat?: string;
    translation?: string;
    kommentar?: string;
    has_usecase?: 'Yes';
    use_case?: Array<number>;
    ort?: Array<number>;
    key_word?: Array<number>;
    start_date?: string;
    end_date?: string;
    /**
     * Intersection.
     */
    text__autor_and?: Array<number>;
    text__autor?: Array<number>;
    /**
     * Intersection.
     */
    text__ort_and?: Array<number>;
    text__ort?: Array<number>;
    text__art?: Array<number>;
    text__start_date?: string;
    text__end_date?: string;
    text__autor__start_date_year?: number;
    text__autor__end_date_year?: number;
    /**
     * Intersection.
     */
    key_word_and?: Array<number>;
    key_word__art?: Array<number>;
    ordering?: string;
  }>;
  export type Response = PaginatedEntityResponse<Passage>;
}

export function useGetPassages(searchParams?: GetPassages.SearchParams, config?: Config) {
  const url = createUrl({ baseUrl, pathname: 'stelle/', searchParams });

  return useRequest(
    config?.isDisabled ? null : createKey(url),
    () => request(url, options),
    defaults
  );
}

export namespace GetPassageById {
  export type PathParams = {
    id: number; // Passage['id'];
  };
  export type SearchParams = {
    // TODO: unclear what any search params will do here
  };
  export type Response = Passage;
}

export function useGetPassageById(
  params: GetPassageById.PathParams,
  searchParams?: GetPassageById.SearchParams,
  config?: Config
) {
  const url = createUrl({ baseUrl, pathname: `stelle/${params.id}`, searchParams });

  return useRequest(
    config?.isDisabled ? null : createKey(url),
    () => request(url, options),
    defaults
  );
}

//

export namespace GetAuthors {
  export type SearchParams = PaginatedEntityRequest<{
    id?: number; // Author['id']
    ids?: Array<number>; // Array<Author['id']>
    legacy_id?: string;
    legacy_pk?: number;
    name?: string;
    gnd_id?: string;
    name_lat?: string;
    name_en?: string;
    name_fr?: string;
    name_it?: string;
    jahrhundert?: string;
    start_date?: string;
    end_date?: string;
    start_date_year?: number;
    end_date_year?: number;
    kommentar?: string;
    ort?: Array<number>;
    has_usecase?: 'Yes';
    rvn_text_autor_autor__rvn_stelle_text_text__key_word?: Array<number>;
    rvn_text_autor_autor__rvn_stelle_text_text__key_word__art?: Array<number>;
    ordering?: string;
  }>;
  export type Response = PaginatedEntityResponse<Author>;
}

export function useGetAuthors(searchParams?: GetAuthors.SearchParams, config?: Config) {
  const url = createUrl({ baseUrl, pathname: 'autor/', searchParams });

  return useRequest(
    config?.isDisabled ? null : createKey(url),
    () => request(url, options),
    defaults
  );
}

export namespace GetAuthorById {
  export type PathParams = {
    id: number; // Author['id'];
  };
  export type SearchParams = {
    // TODO: unclear what any search params will do here
  };
  export type Response = Author;
}

export function useGetAuthorById(
  params: GetAuthorById.PathParams,
  searchParams?: GetAuthorById.SearchParams,
  config?: Config
) {
  const url = createUrl({ baseUrl, pathname: `autor/${params.id}`, searchParams });

  return useRequest(
    config?.isDisabled ? null : createKey(url),
    () => request(url, options),
    defaults
  );
}

//

export namespace GetPlaces {
  export type SearchParams = PaginatedEntityRequest<{
    id?: number; // Place['id']
    ids?: Array<number>; // Array<Place['id']>
    legacy_id?: string;
    legacy_pk?: number;
    name?: string;
    norm_id?: string;
    name_antik?: string;
    name_de?: string;
    name_fr?: string;
    name_it?: string;
    kommentar?: string;
    long?: number;
    lat?: number;
    art?: Array<number>;
    kategorie?: Array<number>;
    rvn_autor_ort_ort?: Array<number>;
    rvn_text_ort_ort?: Array<number>;
    rvn_text_ort_ort__rvn_stelle_text_text__key_word?: Array<number>;
    rvn_text_ort_ort__rvn_stelle_text_text__use_case?: Array<number>;
    rvn_text_ort_ort__rvn_stelle_text_text?: Array<number>;
  }>;
  export type Response = PaginatedEntityResponse<Place>;
}

export function useGetPlaces(searchParams?: GetPlaces.SearchParams, config?: Config) {
  const url = createUrl({ baseUrl, pathname: 'ort/', searchParams });

  return useRequest(
    config?.isDisabled ? null : createKey(url),
    () => request(url, options),
    defaults
  );
}

export namespace GetPlaceById {
  export type PathParams = {
    id: number; // Place['id'];
  };
  export type SearchParams = {
    // TODO: unclear what any search params will do here
  };
  export type Response = Place;
}

export function useGetPlaceById(
  params: GetPlaceById.PathParams,
  searchParams?: GetPlaceById.SearchParams,
  config?: Config
) {
  const url = createUrl({ baseUrl, pathname: `ort/${params.id}`, searchParams });

  return useRequest(
    config?.isDisabled ? null : createKey(url),
    () => request(url, options),
    defaults
  );
}

//

export namespace GetTexts {
  export type SearchParams = PaginatedEntityRequest<{
    id?: number; // Text['id']
    ids?: Array<number>; // Array<Text['id']>
    legacy_id?: string;
    legacy_pk?: number;
    autor?: Array<number>;
    title?: string;
    jahrhundert?: string;
    start_date?: string;
    end_date?: string;
    edition?: string;
    art?: Array<number>;
    ort?: Array<number>;
    kommentar?: string;
    has_usecase?: 'Yes';
    autor__start_date_year?: number;
    autor__end_date_year?: number;
    not_before?: string;
    not_after?: string;
    rvn_stelle_text_text__key_word?: Array<number>;
    rvn_stelle_text_text__key_word__art?: Array<number>;
  }>;
  export type Response = PaginatedEntityResponse<Text>;
}

export function useGetTexts(searchParams?: GetTexts.SearchParams, config?: Config) {
  const url = createUrl({ baseUrl, pathname: 'text/', searchParams });

  return useRequest(
    config?.isDisabled ? null : createKey(url),
    () => request(url, options),
    defaults
  );
}

export namespace GetTextById {
  export type PathParams = {
    id: number; // Text['id'];
  };
  export type SearchParams = {
    // TODO: unclear what any search params will do here
  };
  export type Response = Text;
}

export function useGetTextById(
  params: GetTextById.PathParams,
  searchParams?: GetTextById.SearchParams,
  config?: Config
) {
  const url = createUrl({ baseUrl, pathname: `text/${params.id}`, searchParams });

  return useRequest(
    config?.isDisabled ? null : createKey(url),
    () => request(url, options),
    defaults
  );
}

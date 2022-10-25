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
const limit = 1000;

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

// FIXME:
type PaginatedGeoJsonResponseAlternate<T> = PaginationInfo & {
  results: {
    type: 'FeatureCollection';
    features: Array<T>;
  };
};

//

export interface KeyWordRef {
  url: string;
  legacy_id: string;
  legacy_pk: number;
  stichwort: string;
  name_gr: string;
  // FIXME: what is this? is it a SkosConcept?
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
  // FIXME: what is this? is it a SkosConcept?
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
  url: string;
  /** ... */
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
    // FIXME: seems missing, included only in `ort/` response
    // name_it: string;
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
  url: string;
  id: number;
  title: string;
  principal_investigator: string;
  pi_norm_id: string;
  description: string;
  // FIXME: this is a potentially huge html blob
  story_map: string;
  custom_layer: string | null;
  knightlab_stoy_map: [];
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
  const url = createUrl({
    baseUrl,
    pathname: 'cones/',
    searchParams: { ...searchParams, page_size: limit },
  });
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
    art?: string;
    kategorie?: string;
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
  const url = createUrl({
    baseUrl,
    pathname: 'ort-geojson/',
    searchParams: { ...searchParams, limit },
  });
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
  const url = createUrl({
    baseUrl,
    pathname: 'spatialcoverage/',
    searchParams: { ...searchParams, page_size: limit },
  });
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
  const url = createUrl({
    baseUrl,
    pathname: 'usecase/',
    searchParams: { ...searchParams, limit },
  });
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

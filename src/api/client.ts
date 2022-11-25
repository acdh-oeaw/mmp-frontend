/* eslint-disable @typescript-eslint/no-namespace */

import type { RequestOptions } from '@stefanprobst/request';
import { createUrl, request } from '@stefanprobst/request';
import type { GeometryCollection, Point, Polygon } from 'geojson';

import type {
  Author,
  AuthorNormalized,
  CaseStudy,
  Event,
  EventNormalized,
  GeojsonLayer,
  GeojsonLayerNormalized,
  Keyword,
  KeywordNormalized,
  KeywordType,
  ModelingProcess,
  Passage,
  PassageNormalized,
  Place,
  PlaceNormalized,
  SkosCollection,
  SkosConcept,
  SkosConceptNormalized,
  SkosConceptScheme,
  Slide,
  SpatialCoverage,
  SpatialCoverageGeojsonProperties,
  StopWordNormalized,
  Story,
  StoryNormalized,
  Text,
  TextTopicRelation,
  Topic,
  TopicNormalized,
} from '@/api/models';
import type {
  AutoComplete,
  DateLookupSearchParams,
  Feature,
  FeatureWithBoundingBox,
  LimitOffsetPaginationSearchParams,
  NumberLookupSearchParams,
  PageNumberPaginationSearchParams,
  PaginatedGeoJsonResponse,
  PaginatedResponse,
  ResourceKind,
  SortableSearchParams,
  StringLookupSearchParams,
} from '@/api/types';

//

const baseUrl = import.meta.env.VITE_APP_MMP_API_BASE_URL;

const baseUrls = {
  api: new URL('api/', baseUrl),
  archiv: new URL('archiv/', baseUrl),
  archivAutoComplete: new URL('archiv-ac/', baseUrl),
  autoComplete: new URL('ac/', baseUrl),
  vocabsAutoComplete: new URL('vocabs-ac/', baseUrl),
};

const options: RequestOptions = { responseType: 'json' };

//

export namespace GetAutoComplete {
  export type SearchParams =
    // note that `page_size` is set for each `kind`, so `?kind=autor&kind=keyword&page_size=10` will
    // return 20 results. results are first sorted by `kind` (in the order they are defined in the
    // backend config), then by the model-specific sort field.
    PageNumberPaginationSearchParams & {
      q?: string;
      kind?: Array<ResourceKind>;
    };
  export type Response = {
    q: string;
    filter_on: Array<ResourceKind>;
    page_size: number;
  } & PaginatedResponse<{
    id: number;
    kind: ResourceKind;
    app_name: string;
    label: string;
    url: string;
  }>;
}

export function getAutoComplete(
  searchParams: GetAutoComplete.SearchParams
): Promise<GetAutoComplete.Response> {
  const url = createUrl({
    baseUrl: baseUrls.autoComplete,
    pathname: '',
    searchParams,
  });
  return request(url, options);
}

export namespace GetAuthorsAutoComplete {
  export type SearchParams = AutoComplete.SearchParams;
  export type Response = AutoComplete.Response;
}

export function getAuthorsAutoComplete(
  searchParams: GetAuthorsAutoComplete.SearchParams
): Promise<GetAuthorsAutoComplete.Response> {
  const url = createUrl({
    baseUrl: baseUrls.archivAutoComplete,
    pathname: 'autor-autocomplete/',
    searchParams,
  });
  return request(url, options);
}

export namespace GetKeywordsAutoComplete {
  export type SearchParams = AutoComplete.SearchParams;
  export type Response = AutoComplete.Response;
}

export function getKeywordsAutoComplete(
  searchParams: GetKeywordsAutoComplete.SearchParams
): Promise<GetKeywordsAutoComplete.Response> {
  const url = createUrl({
    baseUrl: baseUrls.archivAutoComplete,
    pathname: 'keyword-autocomplete/',
    searchParams,
  });
  return request(url, options);
}

/** A Region is a Keyword with art="Region". */
export namespace GetRegionKeywordsAutoComplete {
  export type SearchParams = AutoComplete.SearchParams;
  export type Response = AutoComplete.Response;
}

export function getRegionKeywordsAutoComplete(
  searchParams: GetRegionKeywordsAutoComplete.SearchParams
): Promise<GetRegionKeywordsAutoComplete.Response> {
  const url = createUrl({
    baseUrl: baseUrls.archivAutoComplete,
    pathname: 'region-autocomplete/',
    searchParams,
  });
  return request(url, options);
}

/** An Ethnonym is a Keyword with art="Ethnonym". */
export namespace GetEthnonymKeywordsAutoComplete {
  export type SearchParams = AutoComplete.SearchParams;
  export type Response = AutoComplete.Response;
}

export function getEthnonymKeywordsAutoComplete(
  searchParams: GetEthnonymKeywordsAutoComplete.SearchParams
): Promise<GetEthnonymKeywordsAutoComplete.Response> {
  const url = createUrl({
    baseUrl: baseUrls.archivAutoComplete,
    pathname: 'ethnonym-autocomplete/',
    searchParams,
  });
  return request(url, options);
}

/** A Name is a Keyword with art="Eigenname". */
export namespace GetNameKeywordsAutoComplete {
  export type SearchParams = AutoComplete.SearchParams;
  export type Response = AutoComplete.Response;
}

export function getNameKeywordsAutoComplete(
  searchParams: GetNameKeywordsAutoComplete.SearchParams
): Promise<GetNameKeywordsAutoComplete.Response> {
  const url = createUrl({
    baseUrl: baseUrls.archivAutoComplete,
    pathname: 'eigenname-autocomplete/',
    searchParams,
  });
  return request(url, options);
}

/** A KeywordKeyword is a Keyword with art="Keyword". */
export namespace GetKeywordKeywordsAutoComplete {
  export type SearchParams = AutoComplete.SearchParams;
  export type Response = AutoComplete.Response;
}

export function getKeywordKeywordsAutoComplete(
  searchParams: GetKeywordKeywordsAutoComplete.SearchParams
): Promise<GetKeywordKeywordsAutoComplete.Response> {
  const url = createUrl({
    baseUrl: baseUrls.archivAutoComplete,
    pathname: 'schlagwort-autocomplete/',
    searchParams,
  });
  return request(url, options);
}

export namespace GetPlacesAutoComplete {
  export type SearchParams = AutoComplete.SearchParams;
  export type Response = AutoComplete.Response;
}

export function getPlacesAutoComplete(
  searchParams: GetPlacesAutoComplete.SearchParams
): Promise<GetPlacesAutoComplete.Response> {
  const url = createUrl({
    baseUrl: baseUrls.archivAutoComplete,
    pathname: 'ort-autocomplete/',
    searchParams,
  });
  return request(url, options);
}

export namespace GetPassagesAutoComplete {
  export type SearchParams = AutoComplete.SearchParams;
  export type Response = AutoComplete.Response;
}

export function getPassagesAutoComplete(
  searchParams: GetPassagesAutoComplete.SearchParams
): Promise<GetPassagesAutoComplete.Response> {
  const url = createUrl({
    baseUrl: baseUrls.archivAutoComplete,
    pathname: 'stelle-autocomplete/',
    searchParams,
  });
  return request(url, options);
}

export namespace GetTextsAutoComplete {
  export type SearchParams = AutoComplete.SearchParams;
  export type Response = AutoComplete.Response;
}

export function getTextsAutoComplete(
  searchParams: GetTextsAutoComplete.SearchParams
): Promise<GetTextsAutoComplete.Response> {
  const url = createUrl({
    baseUrl: baseUrls.archivAutoComplete,
    pathname: 'text-autocomplete/',
    searchParams,
  });
  return request(url, options);
}

export namespace GetCaseStudiesAutoComplete {
  export type SearchParams = AutoComplete.SearchParams;
  export type Response = AutoComplete.Response;
}

export function getCaseStudiesAutoComplete(
  searchParams: GetCaseStudiesAutoComplete.SearchParams
): Promise<GetCaseStudiesAutoComplete.Response> {
  const url = createUrl({
    baseUrl: baseUrls.archivAutoComplete,
    pathname: 'usecase-autocomplete/',
    searchParams,
  });
  return request(url, options);
}

export namespace GetTextGenreTypesAutoComplete {
  export type SearchParams = AutoComplete.SearchParams;
  export type Response = AutoComplete.Response;
}

export function getTextGenreTypesAutoComplete(
  searchParams: GetTextGenreTypesAutoComplete.SearchParams
): Promise<GetTextGenreTypesAutoComplete.Response> {
  const url = createUrl({
    baseUrl: baseUrls.vocabsAutoComplete,
    pathname: 'specific-concept-ac/art',
    searchParams,
  });
  return request(url, options);
}

export namespace GetPlaceTypesAutoComplete {
  export type SearchParams = AutoComplete.SearchParams;
  export type Response = AutoComplete.Response;
}

export function getPlaceTypesAutoComplete(
  searchParams: GetPlaceTypesAutoComplete.SearchParams
): Promise<GetPlaceTypesAutoComplete.Response> {
  const url = createUrl({
    baseUrl: baseUrls.vocabsAutoComplete,
    pathname: 'specific-concept-ac/place_art',
    searchParams,
  });
  return request(url, options);
}

export namespace GetPlaceCategoriesAutoComplete {
  export type SearchParams = AutoComplete.SearchParams;
  export type Response = AutoComplete.Response;
}

export function getPlaceCategoriesAutoComplete(
  searchParams: GetPlaceCategoriesAutoComplete.SearchParams
): Promise<GetPlaceCategoriesAutoComplete.Response> {
  const url = createUrl({
    baseUrl: baseUrls.vocabsAutoComplete,
    pathname: 'specific-concept-ac/kategorie',
    searchParams,
  });
  return request(url, options);
}

//

export namespace GetAuthors {
  export type SearchParams = LimitOffsetPaginationSearchParams &
    SortableSearchParams & {
      id?: Author['id'];
      /** Comma-separated list of IDs. */
      ids?: string;
      /** Associated with any usecase? */
      has_usecase?: boolean;

      gnd_id?: string;
      gnd_id_lookup?: StringLookupSearchParams;

      name?: string;
      name_lookup?: StringLookupSearchParams;

      name_lat?: string;
      name_lat_lookup?: StringLookupSearchParams;

      name_en?: string;
      name_en_lookup?: StringLookupSearchParams;

      name_fr?: string;
      name_fr_lookup?: StringLookupSearchParams;

      name_it?: string;
      name_it_lookup?: StringLookupSearchParams;

      jahrhundert?: string;
      jahrhundert_lookup?: StringLookupSearchParams;

      start_date?: string;
      start_date_lookup?: DateLookupSearchParams;

      start_date_year?: number;
      start_date_year_lookup?: DateLookupSearchParams;

      end_date?: string;
      end_date_lookup?: DateLookupSearchParams;

      end_date_year?: string;
      end_date_year_lookup?: DateLookupSearchParams;

      /** Places (AND query). */
      ort?: Array<Place['id']>;

      kommentar?: string;
      kommentar_lookup?: StringLookupSearchParams;

      /** Keywords for texts by these authors (AND query). */
      rvn_text_autor_autor__rvn_stelle_text_text__key_word?: Array<Keyword['id']>;

      /** Keyword type. */
      rvn_text_autor_autor__rvn_stelle_text_text__key_word__art?: KeywordType;

      /** Authored texts (AND query). */
      rvn_text_autor_autor?: Array<Text['id']>;

      /**
       * Genres of related texts (AND query).
       *
       * Allowed values are defined in the "art" SkosCollection.
       * @see '/vocabs-ac/specific-concept-ac/art'
       */
      rvn_text_autor_autor__art?: Array<SkosConcept['id']>;

      /** Associated case studies (AND query). */
      rvn_text_autor_autor__rvn_stelle_text_text__use_case?: Array<CaseStudy['id']>;
    };
  export type Response = PaginatedResponse<
    Omit<Author, 'ort'> & {
      /** Place associated with author (birth or activity). */
      ort?: PlaceNormalized | null;
    }
  >;
}

export function getAuthors(searchParams: GetAuthors.SearchParams): Promise<GetAuthors.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'autor/', searchParams });
  return request(url, options);
}

export namespace GetAuthorById {
  export type PathParams = {
    id: Author['id'];
  };
  export type Response = Omit<Author, 'ort'> & {
    /** Place associated with author (birth or activity). */
    ort?: PlaceNormalized | null;
  };
}

export function getAuthorById(params: GetAuthorById.PathParams): Promise<GetAuthorById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `autor/${params.id}` });
  return request(url, options);
}

export namespace GetKeywords {
  export type SearchParams = LimitOffsetPaginationSearchParams &
    SortableSearchParams & {
      id?: Keyword['id'];
      /** Comma-separated list of IDs. */
      ids?: string;
      /** Associated with any usecase? */
      has_usecase?: boolean;

      art?: KeywordType;

      stichwort?: string;
      stichwort_lookup?: StringLookupSearchParams;

      wurzel?: string;
      wurzel_lookup?: StringLookupSearchParams;

      kommentar?: string;
      kommentar_lookup?: StringLookupSearchParams;

      varianten?: string;
      varianten_lookup?: StringLookupSearchParams;

      /** Keywords used by these authors (AND query). */
      rvn_stelle_key_word_keyword__text__autor?: Array<Author['id']>;

      /** Keywords are associated with these passages (AND query). */
      rvn_stelle_key_word_keyword?: Array<Passage['id']>;

      /** Keywords are associated with these texts (AND query). */
      rvn_stelle_key_word_keyword__text?: Array<Text['id']>;

      /**
       * Genres of related texts (AND query).
       *
       * Allowed values are defined in the "art" SkosCollection.
       * @see '/vocabs-ac/specific-concept-ac/art'
       */
      rvn_stelle_key_word_keyword__text__art?: Array<SkosConcept['id']>;

      /** Keywords are associated with these places (AND query). */
      rvn_stelle_key_word_keyword__text__autor__ort?: Array<Place['id']>;

      rvn_stelle_key_word_keyword__text__autor__start_date_year?: string;
      rvn_stelle_key_word_keyword__text__autor__start_date_year_lookup?: DateLookupSearchParams;

      rvn_stelle_key_word_keyword__text__autor__end_date_year?: string;
      rvn_stelle_key_word_keyword__text__autor__end_date_year_lookup?: DateLookupSearchParams;

      rvn_stelle_key_word_keyword__text__not_before?: string;
      rvn_stelle_key_word_keyword__text__not_before_lookup?: DateLookupSearchParams;

      rvn_stelle_key_word_keyword__text__not_after?: string;
      rvn_stelle_key_word_keyword__text__not_after_lookup?: DateLookupSearchParams;

      rvn_stelle_key_word_keyword__start_date?: string;
      rvn_stelle_key_word_keyword__start_date_lookup?: DateLookupSearchParams;

      rvn_stelle_key_word_keyword__end_date?: string;
      rvn_stelle_key_word_keyword__end_date_lookup?: DateLookupSearchParams;

      /** Keywords are associated with these usecases (AND query). */
      rvn_stelle_key_word_keyword__use_case?: Array<CaseStudy['id']>;
    };
  export type Response = PaginatedResponse<KeywordNormalized>;
}

export function getKeywords(searchParams: GetKeywords.SearchParams): Promise<GetKeywords.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'keyword/', searchParams });
  return request(url, options);
}

export namespace GetKeywordById {
  export type PathParams = {
    id: Keyword['id'];
  };
  export type Response = KeywordNormalized;
}

export function getKeywordById(
  params: GetKeywordById.PathParams
): Promise<GetKeywordById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `keyword/${params.id}` });
  return request(url, options);
}

export namespace GetPlaces {
  export type SearchParams = LimitOffsetPaginationSearchParams &
    SortableSearchParams & {
      id?: Place['id'];
      /** Comma-separated list of IDs. */
      ids?: string;
      norm_id?: string;
      norm_id_lookup?: StringLookupSearchParams;

      name?: string;
      name_lookup?: StringLookupSearchParams;

      name_antik?: string;
      name_antik_lookup?: StringLookupSearchParams;

      name_de?: string;
      name_de_lookup?: StringLookupSearchParams;

      name_fr?: string;
      name_fr_lookup?: StringLookupSearchParams;

      name_it?: string;
      name_it_lookup?: StringLookupSearchParams;

      /**
       * Place types (AND query).
       *
       * Allowed values are defined in the "place_art" SkosCollection.
       * @see '/vocabs-ac/specific-concept-ac/place_art'
       */
      art?: Array<SkosConcept['id']>;

      /**
       * Place categories (AND query).
       *
       * Allowed values are defined in the "kategorie" SkosCollection.
       * @see '/vocabs-ac/specific-concept-ac/kategorie'
       */
      kategorie?: Array<SkosConcept['id']>;

      kommentar?: string;
      kommentar_lookup?: StringLookupSearchParams;

      /** Related authors (AND query). */
      rvn_autor_ort_ort?: Array<Author['id']>;

      /** Related texts (AND query). */
      rvn_text_ort_ort?: Array<Text['id']>;

      /** Keywords related to this place via a text (AND query). */
      rvn_text_ort_ort__rvn_stelle_text_text__key_word?: Array<Keyword['id']>;

      /** Places related to these usecases (AND query). */
      rvn_text_ort_ort__rvn_stelle_text_text__use_case?: Array<CaseStudy['id']>;

      /** Places related to these passages (AND query). */
      rvn_text_ort_ort__rvn_stelle_text_text?: Array<Passage['id']>;

      /**
       * Genres of related texts (AND query).
       *
       * Allowed values are defined in the "art" SkosCollection.
       * @see '/vocabs-ac/specific-concept-ac/art'
       */
      rvn_text_ort_ort__art?: Array<SkosConcept['id']>;

      long?: number;
      lat?: number;
    };
  export type Response = PaginatedResponse<PlaceNormalized>;
}

export function getPlaces(searchParams: GetPlaces.SearchParams): Promise<GetPlaces.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'ort/', searchParams });
  return request(url, options);
}

export namespace GetPlaceById {
  export type PathParams = {
    id: Place['id'];
  };
  export type Response = PlaceNormalized;
}

export function getPlaceById(params: GetPlaceById.PathParams): Promise<GetPlaceById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `ort/${params.id}` });
  return request(url, options);
}

export namespace GetPassages {
  export type SearchParams = LimitOffsetPaginationSearchParams &
    SortableSearchParams & {
      id?: Passage['id'];
      /** Comma-separated list of IDs. */
      ids?: string;
      /** Associated with any usecase? */
      has_usecase?: boolean;

      /** Associated texts (AND query). */
      text?: Array<Text['id']>;

      /** Passages included in texts by these authors (AND query). */
      text__autor_and?: Array<Author['id']>;

      /** Passages included in texts by these authors (OR query). */
      text__autor?: Array<Author['id']>;

      /** Passages included in texts related to these places (AND query). */
      text__ort_and?: Array<Place['id']>;

      /** Passages included in texts related to these places (OR query). */
      text__ort?: Array<Place['id']>;

      /**
       * Text genres (AND query).
       *
       * Allowed values are defined in the "art" SkosCollection.
       * @see '/vocabs-ac/specific-concept-ac/art'
       */
      text__art?: Array<SkosConcept['id']>;

      /** Related places (AND query). */
      ort?: Array<Place['id']>;

      summary?: string;
      summary_lookup?: StringLookupSearchParams;

      zitat?: string;
      zitat_lookup?: StringLookupSearchParams;

      translation?: string;
      translation_lookup?: StringLookupSearchParams;

      /** Keyword type. */
      key_word__art?: KeywordType;

      /** Related usecases (AND query). */
      use_case?: Array<CaseStudy['id']>;

      /** Passage contains these keywords (AND query). */
      key_word_and?: Array<Keyword['id']>;

      /** Passage contains these keywords (OR query). */
      key_word?: Array<Keyword['id']>;

      kommentar?: string;
      kommentar_lookup?: StringLookupSearchParams;

      start_date?: number;
      start_date_lookup?: DateLookupSearchParams;

      end_date?: number;
      end_date_lookup?: DateLookupSearchParams;

      text__start_date?: string;
      text__start_date_lookup?: DateLookupSearchParams;

      text__end_date?: string;
      text__end_date_lookup?: DateLookupSearchParams;

      text__autor__start_date_year?: string;
      text__autor__start_date_year_lookup?: DateLookupSearchParams;

      text__autor__end_date_year?: string;
      text__autor__end_date_year_lookup?: DateLookupSearchParams;
    };
  export type Response = PaginatedResponse<
    Omit<Passage, 'key_word' | 'ort' | 'use_case'> & {
      /** Keywords asssociated with the passage. */
      key_word: Array<
        Omit<Keyword, 'related_keyword'> & {
          /** Related keywords. */
          related_keyword: Array<KeywordNormalized>;
        }
      >;
      /** Places of composition. */
      ort: Array<
        Omit<Place, 'art' | 'kategorie'> & {
          /**
           * Type of place.
           *
           * Allowed values are defined in the "place_art" SkosCollection.
           * @see '/vocabs-ac/specific-concept-ac/place_art'
           */
          art?: SkosConceptNormalized | null;
          /**
           * Category of place.
           *
           * Allowed values are defined in the "kategorie" SkosCollection.
           * @see '/vocabs-ac/specific-concept-ac/kategorie'
           */
          kategorie?: SkosConceptNormalized | null;
        }
      >;
      /** Associated usecases. */
      use_case: Array<
        Omit<CaseStudy, 'knightlab_stoy_map'> & {
          /** Knightlab Story Maps. */
          knightlab_stoy_map: Array<StoryNormalized>;
        }
      >;
    }
  >;
}

export function getPassages(searchParams: GetPassages.SearchParams): Promise<GetPassages.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'stelle/', searchParams });
  return request(url, options);
}

export namespace GetPassageById {
  export type PathParams = {
    id: Passage['id'];
  };
  export type Response = Omit<Passage, 'key_word' | 'ort' | 'use_case'> & {
    /** Keywords asssociated with the passage. */
    key_word: Array<
      Omit<Keyword, 'related_keyword'> & {
        /** Related keywords. */
        related_keyword: Array<KeywordNormalized>;
      }
    >;
    /** Places of composition. */
    ort: Array<
      Omit<Place, 'art' | 'kategorie'> & {
        /**
         * Type of place.
         *
         * Allowed values are defined in the "place_art" SkosCollection.
         * @see '/vocabs-ac/specific-concept-ac/place_art'
         */
        art?: SkosConceptNormalized | null;
        /**
         * Category of place.
         *
         * Allowed values are defined in the "kategorie" SkosCollection.
         * @see '/vocabs-ac/specific-concept-ac/kategorie'
         */
        kategorie?: SkosConceptNormalized | null;
      }
    >;
    /** Associated usecases. */
    use_case: Array<
      Omit<CaseStudy, 'knightlab_stoy_map'> & {
        /** Knightlab Story Maps. */
        knightlab_stoy_map: Array<StoryNormalized>;
      }
    >;
  };
}

export function getPassageById(
  params: GetPassageById.PathParams
): Promise<GetPassageById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `stelle/${params.id}` });
  return request(url, options);
}

export namespace GetTexts {
  export type SearchParams = LimitOffsetPaginationSearchParams &
    SortableSearchParams & {
      id?: Text['id'];
      /** Comma-separated list of IDs. */
      ids?: string;
      /** Associated with any usecase? */
      has_usecase?: boolean;

      start_date?: string;
      end_date?: string;

      /** Authors (AND query). */
      autor?: Array<Author['id']>;

      autor__start_date_year?: string;
      autor__start_date_year_lookup?: DateLookupSearchParams;

      autor__end_date_year?: string;
      autor__end_date_year_lookup?: DateLookupSearchParams;

      title?: string;
      title_lookup?: StringLookupSearchParams;

      jahrhundert?: string;
      jahrhundert_lookup?: StringLookupSearchParams;

      not_before?: number;
      not_before_lookup?: DateLookupSearchParams;

      not_after?: number;
      not_after_lookup?: DateLookupSearchParams;

      edition?: string;
      edition_lookup?: StringLookupSearchParams;

      /**
       * Genres (AND query).
       *
       * Allowed values are defined in the "art" SkosCollection.
       * @see '/vocabs-ac/specific-concept-ac/art'
       */
      art?: Array<SkosConcept['id']>;

      /** Related places (AND query). */
      ort?: Array<Place['id']>;

      kommentar?: string;
      kommentar_lookup?: StringLookupSearchParams;

      /** Keywords (AND query). */
      rvn_stelle_text_text__key_word?: Array<Keyword['id']>;

      /** Keyword type. */
      rvn_stelle_text_text__key_word__art?: KeywordType;

      /** Associated case studies (AND query). */
      rvn_stelle_text_text__use_case?: Array<CaseStudy['id']>;
    };
  export type Response = PaginatedResponse<
    Omit<Text, 'autor' | 'art' | 'ort'> & {
      /** Authors. */
      autor: Array<AuthorNormalized>;
      /**
       * Genre.
       *
       * Allowed values are defined in the "art" SkosCollection.
       * @see '/vocabs-ac/specific-concept-ac/art'
       */
      art?: SkosConceptNormalized | null;
      /** Places of composition. */
      ort: Array<PlaceNormalized>;
    }
  >;
}

export function getTexts(searchParams: GetTexts.SearchParams): Promise<GetTexts.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'text/', searchParams });
  return request(url, options);
}

export namespace GetTextById {
  export type PathParams = {
    id: Text['id'];
  };
  export type Response = Omit<Text, 'autor' | 'art' | 'ort'> & {
    /** Authors. */
    autor: Array<AuthorNormalized>;
    /**
     * Genre.
     *
     * Allowed values are defined in the "art" SkosCollection.
     * @see '/vocabs-ac/specific-concept-ac/art'
     */
    art?: SkosConceptNormalized | null;
    /** Places of composition. */
    ort: Array<PlaceNormalized>;
  };
}

export function getTextById(params: GetTextById.PathParams): Promise<GetTextById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `text/${params.id}` });
  return request(url, options);
}

export namespace GetCaseStudies {
  export type SearchParams = LimitOffsetPaginationSearchParams &
    SortableSearchParams & {
      id?: CaseStudy['id'];
      /** Comma-separated list of IDs. */
      ids?: string;

      title?: string;
      title_lookup?: StringLookupSearchParams;

      principal_investigator?: string;
      principal_investigator_lookup?: StringLookupSearchParams;

      pi_norm_id?: string;
      pi_norm_id_lookup?: StringLookupSearchParams;

      description?: string;
      description_lookup?: StringLookupSearchParams;

      /** Related texts (AND query). */
      has_stelle__text?: Array<Text['id']>;

      /** Related authors (AND query). */
      has_stelle__text__autor?: Array<Author['id']>;

      /**
       * Genres of related texts (AND query).
       *
       * Allowed values are defined in the "art" SkosCollection.
       * @see '/vocabs-ac/specific-concept-ac/art'
       */
      has_stelle__text__art?: Array<SkosConcept['id']>;

      /** Related keywords (AND query). */
      has_stelle__key_word?: Array<Keyword['id']>;

      /** Additional GeoJSON layers associated with case study. */
      layer?: Array<GeojsonLayer['id']>;

      /** Should display labels for spatial coverages. */
      show_labels?: boolean;
    };
  export type Response = PaginatedResponse<
    Omit<CaseStudy, 'knightlab_stoy_map' | 'layer'> & {
      knightlab_stoy_map: Array<StoryNormalized>;
      layer: Array<GeojsonLayerNormalized>;
    }
  >;
}

export function getCaseStudies(
  searchParams: GetCaseStudies.SearchParams
): Promise<GetCaseStudies.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'usecase/', searchParams });
  return request(url, options);
}

export namespace GetCaseStudyById {
  export type PathParams = {
    id: CaseStudy['id'];
  };
  export type Response = Omit<CaseStudy, 'knightlab_stoy_map'> & {
    knightlab_stoy_map: Array<StoryNormalized>;
  };
}

export function getCaseStudyById(
  params: GetCaseStudyById.PathParams
): Promise<GetCaseStudyById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `usecase/${params.id}` });
  return request(url, options);
}

export namespace GetGeojsonLayers {
  export type SearchParams = LimitOffsetPaginationSearchParams & {
    use_case?: Array<CaseStudy['id']>;
  };
  export type Response = PaginatedResponse<GeojsonLayerNormalized>;
}

export function getGeojsonLayers(
  searchParams: GetGeojsonLayers.SearchParams
): Promise<GetGeojsonLayers.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'layers/', searchParams });
  return request(url, options);
}

export namespace GetGeojsonLayerById {
  export type PathParams = {
    id: GeojsonLayer['id'];
  };
  export type Response = GeojsonLayerNormalized;
}

export function getGeojsonLayerById(
  params: GetGeojsonLayerById.PathParams
): Promise<GetGeojsonLayerById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `layers/${params.id}` });
  return request(url, options);
}

export namespace GetEvents {
  export type SearchParams = LimitOffsetPaginationSearchParams &
    SortableSearchParams & {
      title?: string;
      title_lookup?: StringLookupSearchParams;

      description?: string;
      description_lookup?: StringLookupSearchParams;

      start_date?: number;
      start_date_lookup?: DateLookupSearchParams;

      end_date?: number;
      end_date_lookup?: DateLookupSearchParams;

      use_case?: Array<CaseStudy['id']>;
    };
  export type Response = PaginatedResponse<EventNormalized>;
}

export function getEvents(searchParams: GetEvents.SearchParams): Promise<GetEvents.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'events/', searchParams });
  return request(url, options);
}

export namespace GetEventById {
  export type PathParams = {
    id: Event['id'];
  };
  export type Response = EventNormalized;
}

export function getEventById(params: GetEventById.PathParams): Promise<GetEventById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `events/${params.id}` });
  return request(url, options);
}

//

export namespace GetModelingProcesses {
  export type SearchParams = LimitOffsetPaginationSearchParams;
  export type Response = PaginatedResponse<ModelingProcess>;
}

export function getModelingProcesses(
  searchParams: GetModelingProcesses.SearchParams
): Promise<GetModelingProcesses.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'modeling-process/', searchParams });
  return request(url, options);
}

export namespace GetModelingProcessById {
  export type PathParams = {
    id: ModelingProcess['id'];
  };
  export type Response = ModelingProcess;
}

export function getModelingProcessById(
  params: GetModelingProcessById.PathParams
): Promise<GetModelingProcessById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `modeling-process/${params.id}` });
  return request(url, options);
}

export namespace GetTextTopicRelations {
  export type SearchParams = LimitOffsetPaginationSearchParams & {
    /** Comma-separated list of IDs. */
    ids?: string;
    /** Related passages (AND query). */
    text?: Array<Passage['id']>;
    /** Related topics (AND query). */
    topic?: Array<Topic['id']>;
    weight?: number;
    weight_lookup?: NumberLookupSearchParams;
  };
  export type Response = PaginatedResponse<
    Omit<TextTopicRelation, 'topic' | 'text'> & {
      text?: PassageNormalized | null;
      topic?: TopicNormalized | null;
    }
  >;
}

export function getTextTopicRelations(
  searchParams: GetTextTopicRelations.SearchParams
): Promise<GetTextTopicRelations.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'text-topic-relation/', searchParams });
  return request(url, options);
}

export namespace GetTextTopicRelationById {
  export type PathParams = {
    id: TextTopicRelation['id'];
  };
  export type Response = Omit<TextTopicRelation, 'topic' | 'text'> & {
    text?: PassageNormalized | null;
    topic?: TopicNormalized | null;
  };
}

export function getTextTopicRelationById(
  params: GetTextTopicRelationById.PathParams
): Promise<GetTextTopicRelationById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `text-topic-relation/${params.id}` });
  return request(url, options);
}

export namespace GetTopics {
  export type SearchParams = LimitOffsetPaginationSearchParams;
  export type Response = PaginatedResponse<Topic>;
}

export function getTopics(searchParams: GetTopics.SearchParams): Promise<GetTopics.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'topics/', searchParams });
  return request(url, options);
}

export namespace GetTopicById {
  export type PathParams = {
    id: Topic['id'];
  };
  export type Response = Topic;
}

export function getTopicById(params: GetTopicById.PathParams): Promise<GetTopicById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `topics/${params.id}` });
  return request(url, options);
}

//

export type PlaceGeojson = { id: Place['id'] } & Feature<
  Point,
  Pick<PlaceNormalized, 'name' | 'name_antik' | 'name_de' | 'name_fr' | 'name_gr' | 'kategorie'> & {
    art: { id: SkosConcept['id']; label: SkosConcept['pref_label'] } | null;
  }
>;

export namespace GetPlacesGeojson {
  export type SearchParams = PageNumberPaginationSearchParams &
    SortableSearchParams &
    Omit<GetPlaces.SearchParams, 'limit' | 'offset'>;
  export type Response = PaginatedGeoJsonResponse<PlaceGeojson>;
}

/** Uses Place['coordinates'] as geojson geometry. */
export function getPlacesGeojson(
  searchParams: GetPlacesGeojson.SearchParams
): Promise<GetPlacesGeojson.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'ort-geojson/', searchParams });
  return request(url, options);
}

export namespace GetPlaceGeojsonById {
  export type PathParams = {
    id: Place['id'];
  };
  export type Response = PlaceGeojson;
}

/** Uses Place['coordinates'] as geojson geometry. */
export function getPlaceGeojsonById(
  params: GetPlaceGeojsonById.PathParams
): Promise<GetPlaceGeojsonById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `ort-geojson/${params.id}` });
  return request(url, options);
}

export type FuzzyPlaceGeojson = { id: Place['id'] } & Feature<
  GeometryCollection,
  Pick<
    PlaceNormalized,
    'name' | 'name_antik' | 'name_de' | 'name_fr' | 'name_gr' | 'art' | 'kategorie'
  > & {
    art: { id: SkosConcept['id']; label: SkosConcept['pref_label'] } | null;
  }
>;

export namespace GetFuzzyPlacesGeojson {
  export type SearchParams = PageNumberPaginationSearchParams &
    SortableSearchParams &
    Omit<GetPlaces.SearchParams, 'limit' | 'offset'>;
  export type Response = PaginatedGeoJsonResponse<FuzzyPlaceGeojson>;
}

/** Uses Place['fuzzy_geom'] as geojson geometry - which seems to always be `null`. */
export function getFuzzyPlacesGeojson(
  searchParams: GetFuzzyPlacesGeojson.SearchParams
): Promise<GetFuzzyPlacesGeojson.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'fuzzy-ort-geojson/', searchParams });
  return request(url, options);
}

export namespace GetFuzzyPlaceGeojsonById {
  export type PathParams = {
    id: Place['id'];
  };
  export type Response = FuzzyPlaceGeojson;
}

/** Uses Place['fuzzy_geom'] as geojson geometry - which seems to always be `null`. */
export function getFuzzyPlaceGeojsonById(
  params: GetFuzzyPlaceGeojsonById.PathParams
): Promise<GetFuzzyPlaceGeojsonById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `fuzzy-ort-geojson/${params.id}` });
  return request(url, options);
}

export type SpatialCoverageSearchParams = {
  id?: SpatialCoverage['id'];

  /** Keywords (AND query). */
  key_word?: Array<Keyword['id']>;
  /** Passages (AND query). */
  stelle?: Array<Passage['id']>;
  /** Usecases (AND query). */
  stelle__use_case?: Array<CaseStudy['id']>;
  /** Places mentioned in passage (AND query). */
  stelle__ort?: Array<Place['id']>;
  /** Places mentioned in related texts (AND query). */
  stelle__text__ort?: Array<Place['id']>;
  /** Related authors (AND query). */
  stelle__text__autor?: Array<Author['id']>;
  /**
   * Genres of related texts (AND query).
   *
   * Allowed values are defined in the "art" SkosCollection.
   * @see '/vocabs-ac/specific-concept-ac/art'
   */
  stelle__text__art?: Array<SkosConcept['id']>;

  stelle__start_date?: number;
  stelle__start_date_lookup?: DateLookupSearchParams;

  stelle__end_date?: number;
  stelle__end_date_lookup?: DateLookupSearchParams;

  stelle__text__not_before?: number;
  stelle__text__not_before_lookup?: DateLookupSearchParams;

  stelle__text__not_after?: number;
  stelle__text__not_after_lookup?: DateLookupSearchParams;

  stelle__text__autor__start_date_year?: number;
  stelle__text__autor__start_date_year_lookup?: DateLookupSearchParams;

  stelle__text__autor__end_date_year?: number;
  stelle__text__autor__end_date_year_lookup?: DateLookupSearchParams;
};

export type ConeGeojson = { id: SpatialCoverage['id'] } & Feature<
  Polygon,
  SpatialCoverageGeojsonProperties
>;

export namespace GetConesGeojson {
  export type SearchParams = PageNumberPaginationSearchParams &
    SortableSearchParams &
    SpatialCoverageSearchParams;
  export type Response = PaginatedGeoJsonResponse<ConeGeojson>;
}

/** Uses SpatialCoverage['convex_hull'] as geojson geometry. */
export function getConesGeojson(
  searchParams: GetConesGeojson.SearchParams
): Promise<GetConesGeojson.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'cones/', searchParams });
  return request(url, options);
}

export namespace GetConeGeojsonById {
  export type PathParams = {
    id: SpatialCoverage['id'];
  };
  export type Response = ConeGeojson;
}

/** Uses SpatialCoverage['convex_hull'] as geojson geometry. */
export function getConeGeojsonById(
  params: GetConeGeojsonById.PathParams
): Promise<GetConeGeojsonById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `cones/${params.id}` });
  return request(url, options);
}

export type SpatialCoverageGeojson = { id: SpatialCoverage['id'] } & FeatureWithBoundingBox<
  Polygon,
  SpatialCoverageGeojsonProperties
>;

export namespace GetSpatialCoveragesGeojson {
  export type SearchParams = PageNumberPaginationSearchParams &
    SortableSearchParams &
    SpatialCoverageSearchParams;
  export type Response = PaginatedGeoJsonResponse<SpatialCoverageGeojson>;
}

/** Uses SpatialCoverage['fuzzy_geom'] as geojson geometry. */
export function getSpatialCoveragesGeojson(
  searchParams: GetSpatialCoveragesGeojson.SearchParams
): Promise<GetSpatialCoveragesGeojson.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'spatialcoverage/', searchParams });
  return request(url, options);
}

export namespace GetSpatialCoverageGeojsonById {
  export type PathParams = {
    id: SpatialCoverage['id'];
  };
  export type Response = SpatialCoverageGeojson;
}

/** Uses SpatialCoverage['fuzzy_geom'] as geojson geometry. */
export function getSpatialCoverageGeojsonById(
  params: GetSpatialCoverageGeojsonById.PathParams
): Promise<GetSpatialCoverageGeojsonById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `spatialcoverage/${params.id}` });
  return request(url, options);
}

export type LinesPointsGeojson = { id: SpatialCoverage['id'] } & FeatureWithBoundingBox<
  GeometryCollection,
  SpatialCoverageGeojsonProperties
>;

export namespace GetLinesPointsGeojson {
  export type SearchParams = PageNumberPaginationSearchParams &
    SortableSearchParams &
    SpatialCoverageSearchParams;
  export type Response = PaginatedGeoJsonResponse<LinesPointsGeojson>;
}

/** Uses SpatialCoverage['geom_collection'] as geojson geometry. */
export function getLinesPointsGeojson(
  searchParams: GetLinesPointsGeojson.SearchParams
): Promise<GetLinesPointsGeojson.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'lines-and-points/', searchParams });
  return request(url, options);
}

export namespace GetLinesPointsGeojsonById {
  export type PathParams = {
    id: SpatialCoverage['id'];
  };
  export type Response = LinesPointsGeojson;
}

/** Uses SpatialCoverage['geom_collection'] as geojson geometry. */
export function getLinesPointsGeojsonById(
  params: GetLinesPointsGeojsonById.PathParams
): Promise<GetLinesPointsGeojsonById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `lines-and-points/${params.id}` });
  return request(url, options);
}

//

export namespace GetStories {
  export type SearchParams = LimitOffsetPaginationSearchParams & SortableSearchParams;
  export type Response = PaginatedResponse<Story>;
}

export function getStories(searchParams: GetStories.SearchParams): Promise<GetStories.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'stories/', searchParams });
  return request(url, options);
}

export namespace GetStoryById {
  export type PathParams = {
    id: Story['id'];
  };
  export type Response = Story;
}

export function getStoryById(params: GetStoryById.PathParams): Promise<GetStoryById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `stories/${params.id}` });
  return request(url, options);
}

export namespace GetStorySlides {
  export type SearchParams = LimitOffsetPaginationSearchParams & SortableSearchParams;
  export type Response = PaginatedResponse<Slide>;
}

export function getStorySlides(
  searchParams: GetStorySlides.SearchParams
): Promise<GetStorySlides.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'slides/', searchParams });
  return request(url, options);
}

export namespace GetStorySlideById {
  export type PathParams = {
    id: Slide['id'];
  };
  export type Response = Slide;
}

export function getStorySlideById(
  params: GetStorySlideById.PathParams
): Promise<GetStorySlideById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `slides/${params.id}` });
  return request(url, options);
}

//

export namespace GetSkosCollections {
  // TODO: https://github.com/acdh-oeaw/acdh-django-vocabs/blob/master/vocabs/filters.py
  export type SearchParams = PageNumberPaginationSearchParams & SortableSearchParams;
  export type Response = PaginatedResponse<SkosCollection>;
}

export function getSkosCollections(
  searchParams: GetSkosCollections.SearchParams
): Promise<GetSkosCollections.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'skoscollections/', searchParams });
  return request(url, options);
}

export namespace GetSkosCollectionById {
  export type PathParams = {
    id: SkosCollection['id'];
  };
  export type Response = SkosCollection;
}

export function getSkosCollectionById(
  params: GetSkosCollectionById.PathParams
): Promise<GetSkosCollectionById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `skoscollections/${params.id}` });
  return request(url, options);
}

export namespace GetSkosConcepts {
  // TODO: https://github.com/acdh-oeaw/acdh-django-vocabs/blob/master/vocabs/filters.py
  export type SearchParams = PageNumberPaginationSearchParams & SortableSearchParams;
  export type Response = PaginatedResponse<SkosConcept>;
}

export function getSkosConcepts(
  searchParams: GetSkosConcepts.SearchParams
): Promise<GetSkosConcepts.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'skosconcepts/', searchParams });
  return request(url, options);
}

export namespace GetSkosConceptById {
  export type PathParams = {
    id: SkosConcept['id'];
  };
  export type Response = SkosConcept;
}

export function getSkosConceptById(
  params: GetSkosConceptById.PathParams
): Promise<GetSkosConceptById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `skosconcepts/${params.id}` });
  return request(url, options);
}

export namespace GetSkosConceptSchemes {
  // TODO: https://github.com/acdh-oeaw/acdh-django-vocabs/blob/master/vocabs/filters.py
  export type SearchParams = PageNumberPaginationSearchParams & SortableSearchParams;
  export type Response = PaginatedResponse<SkosConceptScheme>;
}

export function getSkosConceptSchemes(
  searchParams: GetSkosConceptSchemes.SearchParams
): Promise<GetSkosConceptSchemes.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'skosconceptschemes/', searchParams });
  return request(url, options);
}

export namespace GetSkosConceptSchemeById {
  export type PathParams = {
    id: SkosConceptScheme['id'];
  };
  export type Response = SkosConceptScheme;
}

export function getSkosConceptSchemeById(
  params: GetSkosConceptSchemeById.PathParams
): Promise<GetSkosConceptSchemeById.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: `skosconceptschemes/${params.id}` });
  return request(url, options);
}

//

export namespace GetCaseStudyTimetableById {
  export type PathParams = {
    id: CaseStudy['id'];
  };
  export type Response = Array<{
    id: CaseStudy['id'];
    start_date: number;
    end_date: number;
    ent_type: 'autor' | 'event' | 'text';
    ent_title: string;
    ent_description: string;
    /** Pathname only */
    ent_detail_view: UrlString;
  }>;
}

export function getCaseStudyTimetableById(
  params: GetCaseStudyTimetableById.PathParams
): Promise<GetCaseStudyTimetableById.Response> {
  const url = createUrl({
    baseUrl: baseUrls.archiv,
    pathname: `usecase-timetable-data/${params.id}`,
  });
  return request(url, options);
}

/** Keyword count by century. */
export namespace GetKeywordByCenturyById {
  export type PathParams = {
    id: Keyword['id'];
  };
  export type Response = {
    id: Keyword['id'];
    title: Keyword['stichwort'];
    /** Tuples of century and number of texts which include the keyword, e.g. [9, 123]. */
    data: Array<[number, number]>;
  };
}

export function getKeywordByCenturyById(
  params: GetKeywordByCenturyById.PathParams
): Promise<GetKeywordByCenturyById.Response> {
  const url = createUrl({ baseUrl: baseUrls.archiv, pathname: `keyword/century/${params.id}` });
  return request(url, options);
}

export namespace GetKeywordGraph {
  export type SearchParams = GetPassages.SearchParams;
  export type Response = {
    nodes: Array<{
      id: Keyword['id'];
      type: 'archiv__keyword';
      label: string;
      /** Pathname only. */
      detail_view_url: UrlString;
      /** Pathname only. */
      as_graph: UrlString;
      keyword_type: KeywordType;
    }>;
    edges: Array<{
      id: number;
      source: string;
      target: string;
      type: 'e';
    }>;
    types: {
      nodes: [
        {
          id: 'archiv__keyword';
          label: 'Keyword';
          color: '#006699';
        }
      ];
      edges: [
        {
          id: 'e';
          color: '#990066';
        }
      ];
    };
  };
}

export function getKeywordGraph(
  searchParams: GetKeywordGraph.SearchParams
): Promise<GetKeywordGraph.Response> {
  const url = createUrl({
    baseUrl: baseUrls.archiv,
    pathname: 'keyword-network/',
    searchParams,
  });
  return request(url, options);
}

export namespace GetPassageKeywords {
  export type SearchParams = GetPassages.SearchParams;
  export type Response = {
    token_dict: Array<{ [token: string]: number }>;
  };
}

export function getPassageKeywords(
  searchParams: GetPassageKeywords.SearchParams
): Promise<GetPassageKeywords.Response> {
  const url = createUrl({ baseUrl: baseUrls.archiv, pathname: 'kw-stelle/', searchParams });
  return request(url, options);
}

export namespace GetPassageNlpData {
  export type SearchParams = GetPassages.SearchParams;
  export type Response = {
    token: Array<string>;
    token_dict: Record<string, number>;
    token_count: number;
    unique_token_count: number;
  };
}

export function getPassageNlpData(
  searchParams: GetPassageNlpData.SearchParams
): Promise<GetPassageNlpData.Response> {
  const url = createUrl({ baseUrl: baseUrls.archiv, pathname: 'nlp-data/', searchParams });
  return request(url, options);
}

export namespace GetStopWords {
  export type SearchParams = LimitOffsetPaginationSearchParams;
  export type Response = PaginatedResponse<{
    results: Array<StopWordNormalized>;
  }>;
}

export function getStopWords(
  searchParams: GetStopWords.SearchParams
): Promise<GetStopWords.Response> {
  const url = createUrl({ baseUrl: baseUrls.api, pathname: 'stopwords/', searchParams });
  return request(url, options);
}

/* eslint-disable @typescript-eslint/no-namespace */

import type { Feature as FeatureWithOptionalId, GeoJsonProperties, Geometry } from 'geojson';

export namespace AutoComplete {
  export type SearchParams = {
    q?: string;
  };

  export type Response = {
    results: Array<{ id: string; text: string; selected_text: string }>;
    pagination: { more: boolean };
  };
}

export type PaginatedResponse<T> = {
  count: number;
  next: UrlString | null;
  previous: UrlString | null;
  results: Array<T>;
};

export type LimitOffsetPaginationSearchParams = {
  /** @default 50 */
  limit?: number;
  offset?: number;
};

export type SortableSearchParams = {
  /**
   * Comma-separated list of fields to sort results by. Prefix with minus to sort in descending order.
   *
   * @example
   * ```
   * ordering: 'name,-date'
   * ```
   */
  ordering?: string;
};

export type PaginatedGeoJsonResponse<T extends Feature> = {
  type: 'FeatureCollection';
  count: number;
  next: string | null;
  previous: string | null;
  features: Array<T>;
};

export type PageNumberPaginationSearchParams = {
  /** @default 50 */
  page_size?: number;
  page?: number;
};

/**
 * Foreign key relations are inlined depending on the `depth` config in Django serializers.
 */
export type Normalized<T, Keys extends keyof T, Id extends string | number = number> = {
  [Key in keyof T]: Key extends Keys
    ? Array<never> extends T[Key]
      ? null extends T[Key]
        ? Array<Id> | null
        : Array<Id>
      : null extends T[Key]
      ? Id | null
      : Id
    : T[Key];
};

/** Django LookupChoiceFilter allow providing an optional lookup method. */
export type StringLookupSearchParams = 'icontains' | 'iexact' | 'istartswith' | 'iendswith';
/** Django LookupChoiceFilter allow providing an optional lookup method. */
export type DateLookupSearchParams = 'exact' | 'gt' | 'lt';
/** Django LookupChoiceFilter allow providing an optional lookup method. */
export type NumberLookupSearchParams = 'exact' | 'gt' | 'lt';

export type Feature<G extends Geometry | null = Geometry, P = GeoJsonProperties> = Omit<
  FeatureWithOptionalId<G, P>,
  'id'
>;

export type FeatureWithBoundingBox<
  G extends Geometry | null = Geometry,
  P = GeoJsonProperties
> = Feature<G, P> & {
  bbox: [number, number, number, number];
};

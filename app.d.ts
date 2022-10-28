/// <reference types="vite/client" />

interface Array<T> {
  filter(predicate: BooleanConstructor): Array<NonNullable<T>>;
}

type IsoDateTimeString = string;
type UrlString = string;
type EmptyObject = Record<string, never>;

declare module '*.png';

declare module 'leaflet.markercluster.placementstrategies';

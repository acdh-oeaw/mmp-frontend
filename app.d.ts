/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type IsoDateTimeString = string;
type HtmlString = string;
type UrlString = string;

type Plurals = Pick<Record<Intl.LDMLPluralRule, string>, 'one' | 'other'>;

type DistributiveOmit<T, K extends PropertyType> = T extends unknown ? Omit<T, K> : never;
type DistributivePick<T, K extends PropertyType> = T extends unknown ? Pick<T, K> : never;

type SetOptional<T extends object, K extends keyof T = keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type SetRequired<T extends object, K extends keyof T = keyof T> = Omit<T, K> & Required<Pick<T, K>>;

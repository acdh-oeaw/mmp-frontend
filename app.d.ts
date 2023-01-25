/// <reference types="vite/client" />

interface Array<T> {
  filter(predicate: BooleanConstructor): Array<NonNullable<T>>;
}

type IsoDateTimeString = string;
type HtmlString = string;
type UrlString = string;

type Plurals = Pick<Record<Intl.LDMLPluralRule, string>, 'one' | 'other'>;

type DistributiveOmit<T, K extends PropertyType> = T extends unknown ? Omit<T, K> : never;
type DistributivePick<T, K extends PropertyType> = T extends unknown ? Pick<T, K> : never;

type OptionalKeys<T extends object, K extends keyof T = keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type RequiredKeys<T extends object, K extends keyof T = keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

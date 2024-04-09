type DistributiveOmit<T, K extends PropertyType> = T extends unknown ? Omit<T, K> : never;
type DistributivePick<T, K extends PropertyType> = T extends unknown ? Pick<T, K> : never;

type SetOptional<T extends object, K extends keyof T = keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type SetRequired<T extends object, K extends keyof T = keyof T> = Omit<T, K> & Required<Pick<T, K>>;

type Plurals = Pick<Record<Intl.LDMLPluralRule, string>, "one" | "other">;

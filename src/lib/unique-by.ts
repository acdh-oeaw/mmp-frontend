import { keyBy } from '@stefanprobst/key-by';

export function uniqueBy<T extends object, K extends string | number>(
  values: Array<T>,
  key: (value: T) => K
): Array<T> {
  const keyed = keyBy(values, key);

  return Object.values(keyed);
}

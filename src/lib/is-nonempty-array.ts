type NonEmptyArray<T> = readonly [T, ...ReadonlyArray<T>];

export function isNonEmptyArray<T>(
  values: ReadonlyArray<T> | undefined
): values is NonEmptyArray<T> {
  return Array.isArray(values) && values.length !== 0;
}

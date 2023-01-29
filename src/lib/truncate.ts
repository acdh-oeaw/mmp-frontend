export function truncate(value: string, maxLength: number, ellipsis = '...'): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength - ellipsis.length) + ellipsis;
}

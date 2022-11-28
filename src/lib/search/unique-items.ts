import { isSameItem } from '@/lib/search/is-same-item';
import type { Item } from '@/lib/search/search.types';

export function uniqueItems(a: Array<Item>, b: Array<Item>): Array<Item> {
  return [...a, ...b.filter((item) => !a.some((i) => isSameItem(item, i)))];
}

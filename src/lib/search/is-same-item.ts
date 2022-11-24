import type { Item } from '@/lib/search/types';

export function isSameItem(a: Item, b: Item): boolean {
  return a.id === b.id && a.kind === b.kind;
}

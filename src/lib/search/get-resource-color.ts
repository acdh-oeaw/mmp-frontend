import { colors, keywordColors } from '@/lib/search/search.config';
import type { Item } from '@/lib/search/search.types';

export function getResourceColor(item: Item): string {
  if (item.kind === 'keyword') {
    return keywordColors[item.type];
  }

  return colors[item.kind];
}

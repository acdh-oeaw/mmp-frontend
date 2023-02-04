import { assert } from '@stefanprobst/assert';

import type { ResourceKind } from '@/api';
import type { SearchFilters } from '@/lib/search/use-search-filters';

export function createSearchFilterKey(
  kind: ResourceKind
): Extract<keyof SearchFilters, 'author' | 'keyword'> {
  switch (kind) {
    case 'autor':
      return 'author';
    case 'keyword':
      return 'keyword';
    default:
      assert(false);
  }
}

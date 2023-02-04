import type { Resource } from '@/api';
import { isNotNullable } from '@/lib/is-not-nullable';
import { unique } from '@/lib/unique';
import type { LocationQueryValue } from '@/types/router';

export function getResourceIds(param: LocationQueryValue | undefined): Array<Resource['id']> {
  const value = Array.isArray(param) ? param : [param ?? null];
  const ids = value.filter(isNotNullable).map(Number);

  return unique(ids);
}

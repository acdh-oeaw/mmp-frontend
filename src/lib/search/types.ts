import type { GetAutoComplete } from '@/api';

export type Item = GetAutoComplete.Response['results'][number];

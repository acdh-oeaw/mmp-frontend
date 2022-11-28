import type { GetAutoComplete } from '@/api';

export type Item = Pick<GetAutoComplete.Response['results'][number], 'id' | 'label' | 'kind'>;

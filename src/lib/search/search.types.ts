import type { AutoCompleteItem } from '@/api';

export type Item = DistributiveOmit<AutoCompleteItem, 'app_name' | 'url'>;

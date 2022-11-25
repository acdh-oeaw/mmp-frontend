import { getCurrentInstance } from 'vue';

import type Store from '@/plugins/store';

export function useStore(): typeof Store {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return getCurrentInstance()!.proxy.$store!;
}

import { ref } from 'vue';

import type { ResourceKey } from '@/api';

export function usePassageSearchFormSelection() {
  const selectedKeys = ref<Array<ResourceKey>>([]);

  function setSelectedKeys(keys: Array<ResourceKey>) {
    selectedKeys.value = keys;
  }

  function removeSelectedKey(key: ResourceKey) {
    selectedKeys.value = selectedKeys.value.filter((selectedKey) => selectedKey !== key);
  }

  function clearSelectedKeys() {
    selectedKeys.value = [];
  }

  return {
    selectedKeys,
    setSelectedKeys,
    removeSelectedKey,
    clearSelectedKeys,
  };
}

import { ref } from "vue";

import type { ResourceKey } from "@/api";
import { unique } from "@/lib/unique";

export function useCaseStudiesSearchFormSelection() {
	const selectedKeys = ref<Array<ResourceKey>>([]);

	function setSelectedKeys(keys: Array<ResourceKey>) {
		selectedKeys.value = keys;
	}

	function addSelectedKey(key: ResourceKey) {
		selectedKeys.value = unique([...selectedKeys.value, key]);
	}

	function removeSelectedKey(key: ResourceKey) {
		selectedKeys.value = selectedKeys.value.filter((selectedKey) => {
			return selectedKey !== key;
		});
	}

	function clearSelectedKeys() {
		selectedKeys.value = [];
	}

	return {
		selectedKeys,
		setSelectedKeys,
		addSelectedKey,
		removeSelectedKey,
		clearSelectedKeys,
	};
}

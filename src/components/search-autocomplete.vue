<script lang="ts" setup>
import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxLabel,
	ComboboxOption,
	ComboboxOptions,
} from "@headlessui/vue";
import {
	CheckIcon as CheckMarkIcon,
	ChevronUpDownIcon as SelectorIcon,
	XMarkIcon,
} from "@heroicons/vue/20/solid";
import { groupByToMap } from "@stefanprobst/group-by";
import { computed, ref, watch } from "vue";

import LoadingIndicator from "@/components/loading-indicator.vue";
import { createKey } from "@/lib/create-key";
import { getResourceColor } from "@/lib/search/get-resource-color";
import { splitResourceKey } from "@/lib/search/resource-key";
import { keywordTypeLabels, kindLabels } from "@/lib/search/search.config";
import type { Item } from "@/lib/search/search.types";
import { truncate } from "@/lib/truncate";

const label = "Search";
const placeholder = "Search...";
const _loadingMessage = "Loading...";
const nothingFoundMessage = "Nothing found";

//

const props = defineProps<{
	items: Array<Item>;
	name?: string;
	searchTerm: string;
	selectedKeys: Array<Item["key"]>;
	status?: "fetching" | "idle" | "loading";
}>();

const emit = defineEmits<{
	(event: "change-search-term", searchTerm: string): void;
	(event: "change-selection", selectedKeys: Array<Item["key"]>): void;
}>();

//

function onRemoveSelectedKey(key: Item["key"]) {
	emit(
		"change-selection",
		props.selectedKeys.filter((value) => {
			return value !== key;
		}),
	);
}

function onChangeSelection(selectedKeys: Array<Item["key"]>) {
	emit("change-selection", selectedKeys);
}

function onChangeSearchTerm(event: Event) {
	const element = event.currentTarget as HTMLInputElement;
	emit("change-search-term", element.value);
}

//

/**
 * Store all received items so we can get labels for selected keys, even when they are not in the
 * current set of `items`.
 */
const cache = ref(new Map<Item["key"], Item>());

watch(
	() => {
		return props.items;
	},
	(items) => {
		items.forEach((item) => {
			cache.value.set(item.key, item);
		});
	},
	{ immediate: true },
);

const itemsByKind = computed(() => {
	const groups = groupByToMap(props.items, (item) => {
		return item.kind;
	});

	groups.forEach((group) => {
		group.sort((a, z) => {
			return a.label.localeCompare(z.label);
		});
	});

	/** Sort keyword group to top. */
	const sorted = new Map(
		Array.from(groups).sort(([a], [z]) => {
			if (a === "keyword") return -1;
			if (z === "keyword") return 1;
			return a.localeCompare(z);
		}),
	);

	return sorted;
});

function onLoadItem(item: Item) {
	cache.value.set(item.key, item);
}

//

function getDisplayLabel(key: Item["key"]) {
	if (cache.value.has(key)) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const item = cache.value.get(key)!;
		return item.label;
	}

	return "Unknown";
}

function getRemoveButtonDisplayLabel(key: Item["key"]) {
	return `Remove ${getDisplayLabel(key)}`;
}

function getKindLabel(value: Item) {
	const kindLabel = kindLabels[value.kind].one;
	if (value.kind === "keyword") {
		return `${kindLabel} (${keywordTypeLabels[value.type].one})`;
	}
	return kindLabel;
}

function getColor(key: Item["key"]) {
	if (cache.value.has(key)) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const item = cache.value.get(key)!;
		return getResourceColor(item);
	}

	return undefined;
}
</script>

<template>
	<Combobox
		as="div"
		class="relative"
		:model-value="props.selectedKeys"
		multiple
		:name="props.name"
		@update:model-value="onChangeSelection"
	>
		<div class="grid gap-y-1">
			<ComboboxLabel class="sr-only text-xs font-medium text-neutral-600">
				{{ label }}
			</ComboboxLabel>

			<div
				class="relative flex w-full cursor-default flex-wrap items-center overflow-hidden rounded-lg bg-white text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-300"
			>
				<ul
					v-if="selectedKeys.length > 0"
					class="flex flex-wrap gap-2 px-2 py-1 text-xs"
					role="list"
				>
					<li
						v-for="selectedKey of selectedKeys"
						:key="selectedKey"
						class="relative inline-flex items-center gap-1 overflow-hidden rounded bg-neutral-200 px-2 py-1 font-medium"
						:class="getColor(selectedKey)"
					>
						<template v-if="cache.has(selectedKey)">
							<span class="block truncate">{{ truncate(getDisplayLabel(selectedKey), 25) }}</span>
							<button @click="onRemoveSelectedKey(selectedKey)">
								<span class="sr-only">{{ getRemoveButtonDisplayLabel(selectedKey) }}</span>
								<XMarkIcon aria-hidden="true" class="h-3 w-3" />
							</button>
						</template>

						<template v-else>
							<slot
								name="loading-item"
								:load-item="onLoadItem"
								v-bind="splitResourceKey(selectedKey)"
							/>
						</template>
					</li>
				</ul>

				<div class="relative min-w-[12rem] flex-1">
					<ComboboxInput
						autocomplete="off"
						class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-neutral-900 focus-visible:outline-none"
						:placeholder="placeholder"
						type="search"
						:value="props.searchTerm"
						@change="onChangeSearchTerm"
					/>
					<div class="absolute inset-y-0 right-6 flex items-center pr-2 text-neutral-400">
						<LoadingIndicator v-if="props.status === 'fetching'" class="h-4 w-4" />
					</div>
					<ComboboxButton
						class="absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-400"
					>
						<SelectorIcon class="h-5 w-5" aria-hidden="true" />
					</ComboboxButton>
				</div>
			</div>
		</div>

		<Transition
			leave-active-class="transition duration-100 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<ComboboxOptions
				class="absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 transition focus-visible:outline-none"
			>
				<li
					v-if="searchTerm !== '' && props.items.length === 0"
					class="relative cursor-default select-none py-2 px-4 text-neutral-700"
				>
					{{ nothingFoundMessage }}
				</li>
				<li
					v-for="[key, _items] of itemsByKind"
					v-else
					:key="key"
					:class="{ 'opacity-50': props.status === 'fetching' }"
					role="presentation"
				>
					<span
						:id="createKey('autocomplete-section', key)"
						class="block cursor-default select-none px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500"
						aria-hidden="true"
					>
						{{ kindLabels[key].other }}
					</span>
					<ul role="group" :aria-labelledby="createKey('autocomplete-section', key)">
						<ComboboxOption
							v-for="item of _items"
							v-slot="{ selected }"
							:key="item.key"
							:value="item.key"
							class="relative grid cursor-default select-none gap-1 py-2 pr-10 pl-4 ui-active:bg-neutral-100 ui-active:text-neutral-900"
						>
							<span class="block truncate ui-selected:font-medium">{{ item.label }}</span>
							<span class="block text-xs text-neutral-500">{{ getKindLabel(item) }}</span>
							<span
								v-if="selected"
								class="absolute inset-y-0 right-0 grid place-items-center pr-3 text-neutral-600"
							>
								<CheckMarkIcon aria-hidden="true" class="h-5 w-5" />
							</span>
						</ComboboxOption>
					</ul>
				</li>
			</ComboboxOptions>
		</Transition>
	</Combobox>
</template>

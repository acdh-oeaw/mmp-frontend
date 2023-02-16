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

import { getResourceColor } from "@/lib/search/get-resource-color";
import { keywordTypeLabels, kindLabels } from "@/lib/search/search.config";
import type { Item } from "@/lib/search/search.types";
import { truncate } from "@/lib/truncate";

const props = defineProps<{
	items: Array<Item>;
	name?: string;
	searchTerm: string;
	selectedKeys: Array<Item["key"]>;
}>();

const emit = defineEmits<{
	(event: "change-search-term", searchTerm: string): void;
	(event: "change-selection", selectedKeys: Array<Item["key"]>): void;
}>();

//

const label = "Search";
const placeholder = "Search...";
const loadingMessage = "Loading...";
const nothingFoundMessage = "Nothing found";

//

function onRemoveSelectedKey(key: Item["key"]) {
	emit(
		"change-selection",
		props.selectedKeys.filter((value) => {
			return value !== key;
		}),
	);
}

function onChangeSelection(value: Array<Item["key"]>) {
	emit("change-selection", value);
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
		[...groups.entries()].sort(([a], [z]) => {
			if (a === "keyword") return -1;
			return a.localeCompare(z);
		}),
	);

	return sorted;
});

function onLoadItem(item: Item) {
	cache.value.set(item.key, item);
}

//

function getDisplayLabel(selectedKey: unknown) {
	return cache.value.get(selectedKey as Item["key"])?.label ?? "Unknown";
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
				class="relative flex w-full cursor-default flex-wrap items-center overflow-hidden rounded-lg bg-white text-left text-sm shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-300"
			>
				<ul
					v-if="selectedKeys.length > 0"
					class="flex flex-wrap gap-2 px-2 py-1 text-xs"
					role="list"
				>
					<li
						v-for="key of selectedKeys"
						:key="key"
						class="relative inline-flex items-center gap-1 overflow-hidden rounded bg-neutral-200 px-2 py-1 font-medium"
					>
						<template v-if="cache.has(key)">
							<span class="relative block truncate">{{ truncate(getDisplayLabel(key), 25) }}</span>
							<button class="relative" @click="onRemoveSelectedKey(key)">
								<span class="sr-only">{{ getRemoveButtonDisplayLabel(key) }}</span>
								<XMarkIcon aria-hidden="true" class="h-3 w-3" />
							</button>
						</template>
						<template v-else>
							<slot name="loading-item" :load-item="onLoadItem" />
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
					<ComboboxButton
						class="absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-400"
					>
						<SelectorIcon class="h-5 w-5" aria-hidden="true" />
					</ComboboxButton>
				</div>
			</div>
		</div>

		<transition
			leave-active-class="transition duration-100 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<ComboboxOptions
				class="absolute z-50 mt-1 w-full rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none"
			>
				<div
					v-if="searchTerm !== '' && props.items.length === 0"
					class="relative cursor-default select-none py-2 px-4 text-neutral-700"
				>
					{{ nothingFoundMessage }}
				</div>
				<div class="max-h-80 overflow-auto">
					<li v-for="[key, _items] of itemsByKind" :key="key" role="presentation">
						<span
							:id="key"
							class="block px-4 py-2 text-xs font-medium uppercase tracking-wider text-neutral-500"
							aria-hidden="true"
						>
							{{ key }}
						</span>
						<ul role="group" :aria-labelledby="key">
							<ComboboxOption
								v-for="item of _items"
								v-slot="{ selected }"
								:key="item.key"
								:value="item.key"
								class="ui-active:bg-neutral-100 ui-active:text-neutral-900 relative cursor-default select-none py-2 pl-10 pr-4"
							>
								<span class="ui-selected:font-medium block truncate">
									{{ item.label }}
								</span>
								<span
									v-if="selected"
									class="absolute inset-y-0 left-0 grid place-items-center pl-3 text-neutral-600"
								>
									<CheckMarkIcon aria-hidden="true" class="h-5 w-5" />
								</span>
							</ComboboxOption>
						</ul>
					</li>
				</div>
			</ComboboxOptions>
		</transition>
	</Combobox>
</template>

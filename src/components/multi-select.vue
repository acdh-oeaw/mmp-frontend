<script lang="ts" setup>
import {
	Listbox,
	ListboxButton,
	ListboxLabel,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/vue";
import {
	CheckIcon as CheckMarkIcon,
	ChevronUpDownIcon as SelectorIcon,
} from "@heroicons/vue/20/solid";
import { keyByToMap } from "@stefanprobst/key-by";
import { computed } from "vue";

import { createList } from "@/lib/create-list";

interface Item {
	key: string;
	label: string;
	description?: string;
}

const props = defineProps<{
	items: Array<Item>;
	label: string;
	name?: string;
	placeholder?: string;
	selectedKeys: Array<Item["key"]>;
}>();

const emit = defineEmits<{
	(event: "change-selection", selectedKeys: Array<Item["key"]>): void;
}>();

//

function onChangeSelection(selectedKeys: Array<Item["key"]>) {
	emit("change-selection", selectedKeys);
}

//

const itemsByKey = computed(() => {
	return keyByToMap(props.items, (item) => {
		return item.key;
	});
});

//

function getDisplayLabel(selectedKey: Item["key"]) {
	if (itemsByKey.value.has(selectedKey)) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const item = itemsByKey.value.get(selectedKey)!;
		return item.label;
	}

	return "Unknown";
}
</script>

<template>
	<Listbox
		as="div"
		class="relative"
		:model-value="props.selectedKeys"
		multiple
		:name="props.name"
		@update:model-value="onChangeSelection"
	>
		<div class="grid gap-y-1">
			<ListboxLabel class="sr-only text-xs font-medium text-neutral-600">
				{{ label }}
			</ListboxLabel>

			<ListboxButton
				class="relative w-full min-w-[12rem] cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-300"
			>
				<span v-if="selectedKeys.length > 0" class="flex flex-wrap gap-2">
					{{ createList(selectedKeys.map(getDisplayLabel)) }}
				</span>
				<span v-else class="block truncate text-neutral-500">
					{{ props.placeholder ?? "Select a value" }}
				</span>
				<span
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-400"
				>
					<SelectorIcon class="h-5 w-5" aria-hidden="true" />
				</span>
			</ListboxButton>
		</div>

		<Transition
			leave-active-class="transition duration-100 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<ListboxOptions
				class="absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 transition focus-visible:outline-none"
			>
				<ListboxOption
					v-for="item of items"
					v-slot="{ selected }"
					:key="item.key"
					:value="item.key"
					class="relative grid cursor-default select-none gap-1 py-2 pr-10 pl-4 ui-active:bg-neutral-100 ui-active:text-neutral-900"
				>
					<span class="block truncate ui-selected:font-medium">{{ item.label }}</span>
					<span v-if="item.description" class="block text-xs text-neutral-500">
						{{ item.description }}
					</span>
					<span
						v-if="selected"
						class="absolute inset-y-0 right-0 grid place-items-center pr-3 text-neutral-600"
					>
						<CheckMarkIcon aria-hidden="true" class="h-5 w-5" />
					</span>
				</ListboxOption>
			</ListboxOptions>
		</Transition>
	</Listbox>
</template>

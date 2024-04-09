<script lang="ts" setup>
import { keyByToMap } from "@acdh-oeaw/lib";
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
import { computed } from "vue";

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
	selectedKey?: Item["key"];
}>();

const emit = defineEmits<(event: "change-selection", selectedKey: Item["key"]) => void>();

//

function onChangeSelection(selectedKey: Item["key"]) {
	emit("change-selection", selectedKey);
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
		:model-value="props.selectedKey"
		:name="props.name"
		@update:model-value="onChangeSelection"
	>
		<div class="grid gap-y-1">
			<ListboxLabel class="sr-only text-xs font-medium text-neutral-600">
				{{ label }}
			</ListboxLabel>

			<ListboxButton
				class="relative w-full min-w-[12rem] cursor-default rounded-md border border-neutral-200 bg-white py-2 pl-3 pr-10 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-300"
			>
				<span v-if="selectedKey" class="block truncate">{{ getDisplayLabel(selectedKey) }}</span>
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
					class="relative grid cursor-default select-none gap-1 py-2 pl-4 pr-10 ui-active:bg-neutral-100 ui-active:text-neutral-900"
				>
					<span class="block ui-selected:font-medium">{{ item.label }}</span>
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

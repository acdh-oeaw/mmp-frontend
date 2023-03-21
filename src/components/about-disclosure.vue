<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
	title: string;
}>();
</script>

<template>
	<Disclosure v-slot="{ open }">
		<DisclosureButton as="div" class="flex cursor-pointer items-center justify-between">
			<h2 class="my-6 text-blue-900">
				{{ props.title }}
			</h2>
			<ChevronDownIcon class="h-5 w-5 transition" :class="open && 'rotate-180'" />
		</DisclosureButton>
		<DisclosurePanel>
			<slot />
		</DisclosurePanel>
	</Disclosure>
</template>

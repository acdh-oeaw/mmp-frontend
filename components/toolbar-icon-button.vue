<script lang="ts" setup>
const props = defineProps<{
	label: string;
}>();
</script>

<template>
	<button
		class="grid grid-flow-col place-items-center gap-2 rounded border border-neutral-200 p-1 text-sm transition hover:bg-neutral-100 hover:text-neutral-700 lg:px-2"
	>
		<slot />
		<span class="sr-only lg:not-sr-only">{{ props.label }}</span>
	</button>
</template>

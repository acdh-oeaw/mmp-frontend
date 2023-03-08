<script lang="ts" setup>
const props = defineProps<{
	label: string;
}>();
</script>

<template>
	<button class="grid h-8 w-8 place-items-center p-1 transition hover:text-neutral-700">
		<span class="sr-only">{{ props.label }}</span>
		<slot />
	</button>
</template>

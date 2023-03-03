<script lang="ts" setup>
const emit = defineEmits<{
	(event: "click"): void;
}>();

function onClick() {
	emit("click");
}
</script>

<template>
	<button class="rounded bg-neutral-900 px-2 py-1 text-xs font-medium text-white" @click="onClick">
		<slot />
	</button>
</template>

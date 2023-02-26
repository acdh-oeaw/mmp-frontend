<script lang="ts" setup>
const props = defineProps<{
	label: string;
}>();

const emit = defineEmits<{
	(event: "click"): void;
}>();

function onClick() {
	emit("click");
}
</script>

<template>
	<button class="rounded bg-neutral-900 px-2 py-1 text-xs font-medium text-white" @click="onClick">
		<span>{{ props.label }}</span>
	</button>
</template>

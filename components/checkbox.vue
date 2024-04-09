<script lang="ts" setup>
const props = defineProps<{
	checked: boolean;
	name?: string;
	value?: string;
}>();

const emit = defineEmits<{
	(event: "change", checked: boolean): void;
}>();

function onChange(event: Event) {
	const element = event.currentTarget as HTMLInputElement;
	emit("change", element.checked);
}
</script>

<template>
	<label class="flex items-center gap-1">
		<input
			:checked="props.checked"
			:name="props.name"
			type="checkbox"
			:value="props.value"
			@change="onChange"
		/>
		<slot />
	</label>
</template>

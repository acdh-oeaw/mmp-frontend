<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		position: "bottom left" | "bottom right" | "top left" | "top right";
	}>(),
	{ position: "bottom left" },
);
</script>

<template>
	<div
		class="absolute m-4 flex items-center gap-2 rounded-md bg-white py-2 px-4 shadow-lg"
		data-overlay-panel
		:data-position="props.position"
	>
		<slot />
	</div>
</template>

<style>
[data-position~="top"] {
	top: 0;
}

[data-position~="bottom"] {
	bottom: 0;
}

[data-position~="left"] {
	left: 0;
}

[data-position~="right"] {
	right: 0;
}
</style>

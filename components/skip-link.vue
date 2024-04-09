<script lang="ts" setup>
const id = "main-content";
</script>

<template>
	<div class="absolute z-50 -translate-y-full px-1 py-px transition focus-within:translate-y-0">
		<a class="flex rounded-md bg-neutral-900 p-4 font-semibold text-white" :href="`#${id}`">
			Skip to main content
		</a>
	</div>
</template>

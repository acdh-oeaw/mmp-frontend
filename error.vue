<script lang="ts" setup>
import Centered from "@/components/centered.vue";
import MainContent from "@/components/main-content.vue";
import { clearError } from "#app";

const _props = defineProps<{
	error: unknown;
}>();

function handleError() {
	void clearError({ redirect: "/" });
}
</script>

<template>
	<MainContent>
		<Centered>
			<div class="grid gap-2">
				<span>Something went horribly wrong.</span>
				<button @click="handleError">Clear errors</button>
			</div>
		</Centered>
	</MainContent>
</template>

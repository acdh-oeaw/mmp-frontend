<script lang="ts" setup>
import { useFullScreen } from "../lib/use-full-screen";

const isFullscreen = useFullScreen();
</script>

<template>
	<div v-if="isFullscreen" class="fixed inset-0">
		<slot />
	</div>
	<slot v-else />
</template>

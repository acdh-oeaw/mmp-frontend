<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import { useHead } from "#imports";

const title = "About";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});
</script>

<template>
	<MainContent>
		<div class="mx-auto w-full max-w-4xl px-8 py-4">
			<h1 class="sr-only">About</h1>

			<div class="prose-sm">
				<!-- TODO: -->
			</div>
		</div>
	</MainContent>
</template>

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
		<h1>About</h1>
	</MainContent>
</template>

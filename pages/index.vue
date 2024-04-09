<script lang="ts" setup>
import Hero from "@/components/hero.vue";
import MainContent from "@/components/main-content.vue";
import { useHead } from "#imports";

const title = "Home";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});
</script>

<template>
	<MainContent>
		<Hero />
	</MainContent>
</template>

<script lang="ts" setup>
import { useHead } from "#imports";

const title = "Search results";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});
</script>

<template>
	<h2 class="sr-only">Search results</h2>
</template>

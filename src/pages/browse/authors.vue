<script lang="ts" setup>
import { useHead } from "#imports";

const title = "Browse authors";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});
</script>

<template>
	<h2 class="sr-only">Browse authors</h2>
</template>

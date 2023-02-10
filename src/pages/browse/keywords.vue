<script lang="ts" setup>
import { useHead } from "#imports";

const title = "Browse keywords";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});
</script>

<template>
	<h2 class="sr-only">Browse keywords</h2>
</template>

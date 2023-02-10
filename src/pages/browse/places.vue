<script lang="ts" setup>
import { useHead } from "#imports";

const title = "Browse places";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});
</script>

<template>
	<h2 class="sr-only">Browse places</h2>
</template>

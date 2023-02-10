<script lang="ts" setup>
import { useHead } from "#imports";

const title = "Story";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});
</script>

<template>
	<h2 class="sr-only">Story</h2>
</template>

<script lang="ts" setup>
import { useHead } from "#imports";

const title = "Timeline";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});
</script>

<template>
	<h2 class="sr-only">Timeline</h2>
</template>

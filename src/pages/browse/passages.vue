<script lang="ts" setup>
import { useHead } from "#imports";

const title = "Browse passages";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});
</script>

<template>
	<h2 class="sr-only">Browse passages</h2>
</template>

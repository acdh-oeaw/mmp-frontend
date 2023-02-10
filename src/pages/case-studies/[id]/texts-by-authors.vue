<script lang="ts" setup>
import { useHead } from "#imports";

const title = "Texts by authors";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});
</script>

<template>
	<h2 class="sr-only">Texts by authors</h2>
</template>

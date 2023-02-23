<script lang="ts" setup>
import { useCaseStudyIdParam } from "@/lib/case-studies/use-case-study-id-param";
import { useHead } from "#imports";

const title = "Texts by authors";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const id = useCaseStudyIdParam();
</script>

<template>
	<h2 class="sr-only">Texts by authors</h2>
</template>

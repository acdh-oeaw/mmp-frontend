<script lang="ts" setup>
import { useCaseStudyIdParam } from "@/lib/case-studies/use-case-study-id-param";
import { useHead } from "#imports";

const title = "Network-graph visualisation";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const id = useCaseStudyIdParam();
</script>

<template>
	<h2 class="sr-only">Network-graph visualisation</h2>
</template>

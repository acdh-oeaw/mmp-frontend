<script lang="ts" setup>
import CaseStudiesSearchForm from "@/components/case-studies-search-form.vue";
import CaseStudiesSearchResults from "@/components/case-studies-search-results.vue";
import MainContent from "@/components/main-content.vue";
import { useHead } from "#imports";

const title = "Case studies";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});
</script>

<template>
	<div class="grid h-full grid-rows-[auto_1fr]">
		<h1 class="sr-only">Case studies</h1>

		<aside>
			<div class="mx-auto w-full max-w-7xl px-8 py-4">
				<CaseStudiesSearchForm />
			</div>
		</aside>

		<MainContent>
			<CaseStudiesSearchResults />
		</MainContent>
	</div>
</template>

<script lang="ts" setup>
import CaseStudiesSearchForm from "@/components/case-studies-search-form.vue";
import MainContent from "@/components/main-content.vue";
import { NuxtPage } from "#components";
</script>

<template>
	<div>
		<h1>Case studies</h1>

		<aside>
			<div class="max-w-7xl px-8 py-4">
				<CaseStudiesSearchForm />
			</div>
		</aside>

		<MainContent>
			<div class="max-w-7xl px-8 py-4">
				<NuxtPage />
			</div>
		</MainContent>
	</div>
</template>

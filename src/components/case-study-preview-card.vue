<script lang="ts" setup>
import { type CaseStudy } from "@/api";
import { NuxtLink } from "#components";

const props = defineProps<{
	caseStudy: CaseStudy;
}>();
</script>

<template>
	<article class="grid gap-4 rounded-lg bg-white p-8 shadow-lg">
		<h3 class="text-xl font-medium">
			<NuxtLink :href="`/case-studies/${props.caseStudy.id}/timeline`">
				{{ props.caseStudy.title }}
			</NuxtLink>
		</h3>
		<dl>
			<div class="flex gap-2">
				<dt class="sr-only">Principal investigator</dt>
				<dd class="font-medium text-neutral-600">{{ props.caseStudy.principal_investigator }}</dd>
			</div>
		</dl>
		<p class="leading-7 text-neutral-600 line-clamp-4">{{ props.caseStudy.description }}</p>
		<footer class="justify-self-end">
			<NuxtLink
				class="inline-flex rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
				:href="`/case-studies/${props.caseStudy.id}/timeline`"
			>
				Read more
				<span class="sr-only">about {{ props.caseStudy.title }}</span>
			</NuxtLink>
		</footer>
	</article>
</template>

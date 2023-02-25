<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import { NuxtLink, NuxtPage } from "#components";
import { useHead } from "#imports";

const title = "Browse";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const links = {
	authors: { path: "authors", label: "Authors" },
	keywords: { path: "keywords", label: "Keywords" },
	passages: { path: "passages", label: "Passages" },
	places: { path: "places", label: "Places" },
};
</script>

<template>
	<div class="grid h-full grid-rows-[auto_1fr]">
		<h1 class="sr-only">Browse the data</h1>

		<nav aria-label="Content types" class="p-8">
			<ul class="flex flex-wrap items-center justify-center gap-8" role="list">
				<li v-for="(link, key) of links" :key="key">
					<NuxtLink :href="{ path: link.path }">{{ link.label }}</NuxtLink>
				</li>
			</ul>
		</nav>

		<MainContent>
			<NuxtPage />
		</MainContent>
	</div>
</template>

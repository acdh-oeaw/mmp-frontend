<script lang="ts" setup>
import BrowseSearchForm from "@/components/browse-search-form.vue";
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
	<div class="grid h-full grid-rows-[auto_auto_1fr]">
		<h1 class="sr-only">Browse the data</h1>

		<aside>
			<div class="mx-auto w-full max-w-7xl px-8 py-4">
				<BrowseSearchForm />
			</div>
		</aside>

		<nav aria-label="Content types" class="p-8">
			<ul class="flex flex-wrap items-center justify-center gap-x-8 gap-y-2" role="list">
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

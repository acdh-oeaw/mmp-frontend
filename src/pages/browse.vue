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

		<nav aria-label="Content types" class="border-b border-neutral-200">
			<ul
				class="mx-auto grid max-w-7xl grid-cols-2 items-center gap-x-8 gap-y-2 px-8 pt-4 font-medium md:grid-cols-4"
				role="list"
			>
				<li v-for="(link, key) of links" :key="key">
					<NuxtLink
						class="flex justify-center rounded-t p-2 text-center transition hover:bg-neutral-100 aria-[current]:bg-neutral-200"
						:href="{ path: link.path }"
					>
						{{ link.label }}
					</NuxtLink>
				</li>
			</ul>
		</nav>

		<MainContent>
			<NuxtPage />
		</MainContent>
	</div>
</template>

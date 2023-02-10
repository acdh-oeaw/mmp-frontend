<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import { NuxtLink, NuxtPage } from "#components";

const links = {
	authors: { href: "authors", label: "Authors" },
	keywords: { href: "keywords", label: "Keywords" },
	passages: { href: "passages", label: "Passages" },
	places: { href: "places", label: "Places" },
};
</script>

<template>
	<div class="grid h-full grid-rows-[auto_1fr]">
		<h1 class="sr-only">Browse the data</h1>

		<nav aria-label="Content types">
			<ul class="flex flex-wrap justify-center gap-8" role="list">
				<li v-for="(link, key) of links" :key="key">
					<NuxtLink :href="link.href">{{ link.label }}</NuxtLink>
				</li>
			</ul>
		</nav>

		<MainContent>
			<NuxtPage />
		</MainContent>
	</div>
</template>

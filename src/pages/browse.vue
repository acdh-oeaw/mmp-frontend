<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import { NuxtLink, NuxtPage } from "#components";

const links = {
	authors: {
		href: "authors",
		label: "Authors",
	},
	keywords: {
		href: "keywords",
		label: "Keywords",
	},
	passages: {
		href: "passages",
		label: "Passages",
	},
	places: {
		href: "places",
		label: "Places",
	},
};
</script>

<template>
	<div>
		<h1 class="sr-only">Browse the data</h1>

		<nav aria-label="Content types">
			<ul role="list">
				<li v-for="(link, key) of links" :key="key">
					<NuxtLink :href="link.href">{{ link.label }}</NuxtLink>
				</li>
			</ul>
		</nav>

		<MainContent>
			<div class="max-w-7xl px-8 py-4">
				<NuxtPage />
			</div>
		</MainContent>
	</div>
</template>

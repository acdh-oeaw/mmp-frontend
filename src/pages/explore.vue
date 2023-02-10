<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import PassageSearchForm from "@/components/passage-search-form.vue";
import { NuxtLink, NuxtPage } from "#components";

const links = {
	"search-results": { href: "search-results", label: "Search results" },
	"network-graph-visualisation": { href: "network-graph-visualisation", label: "Network graph" },
	"geo-visualisation": { href: "geo-visualisation", label: "Map" },
	"word-cloud-visualisation": { href: "word-cloud-visualisation", label: "Word cloud" },
};
</script>

<template>
	<div>
		<h1 class="sr-only">Explore the data</h1>

		<aside>
			<div class="max-w-7xl px-8 py-4">
				<PassageSearchForm />
			</div>
		</aside>

		<nav aria-label="Passages">
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

<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import { NuxtLink, NuxtPage } from "#components";
import { useHead } from "#imports";

const title = "Case study";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const links = {
	timeline: { href: "timeline", label: "Timeline" },
	story: { href: "story", label: "Story" },
	"network-graph-visualisation": { href: "network-graph-visualisation", label: "Network graph" },
	"geo-map-visualisation": { href: "geo-map-visualisation", label: "Map" },
	"word-cloud-visualisation": { href: "word-cloud-visualisation", label: "Word cloud" },
	"texts-by-authors": { href: "texts-by-authors", label: "Texts by authors" },
};
</script>

<template>
	<div class="grid h-full grid-rows-[auto_auto_1fr]">
		<h1 class="sr-only">Case study</h1>

		<nav aria-label="Case study">
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

<script lang="ts" setup>
import { computed } from "vue";

import MainContent from "@/components/main-content.vue";
import SidePanel from "@/components/side-panel.vue";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { NuxtLink, NuxtPage } from "#components";
import { useHead } from "#imports";

const title = "Case study";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const { createSearchFilterParams, searchFilters } = useSearchFilters();
const query = computed(() => {
	return createSearchFilterParams(searchFilters.value);
});

const links = {
	timeline: { path: "timeline", label: "Timeline" },
	story: { path: "story", label: "Story" },
	"network-graph-visualisation": { path: "network-graph-visualisation", label: "Network graph" },
	"geo-map-visualisation": { path: "geo-map-visualisation", label: "Map" },
	"word-cloud-visualisation": { path: "word-cloud-visualisation", label: "Word cloud" },
	"texts-by-authors": { path: "texts-by-authors", label: "Texts by authors" },
};
</script>

<template>
	<div class="grid h-full grid-rows-[auto_auto_1fr]">
		<h1 class="sr-only">Case study</h1>

		<nav aria-label="Case study" class="p-8">
			<ul class="flex flex-wrap items-center justify-center gap-8" role="list">
				<li v-for="(link, key) of links" :key="key">
					<NuxtLink :href="{ path: link.path, query }">{{ link.label }}</NuxtLink>
				</li>
			</ul>
		</nav>

		<MainContent>
			<NuxtPage />
		</MainContent>

		<SidePanel />
	</div>
</template>

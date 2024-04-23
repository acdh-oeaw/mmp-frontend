<script lang="ts" setup>
import { computed } from "vue";

import MainContent from "@/components/main-content.vue";
import PassageSearchForm from "@/components/passage-search-form.vue";
import SidePanel from "@/components/side-panel.vue";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { NuxtLink, NuxtPage } from "#components";
import { useHead } from "#imports";

const title = "Explore";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const { createSearchFilterParams, searchFilters } = useSearchFilters();
const query = computed(() => {
	return createSearchFilterParams(searchFilters.value);
});

const links = {
	"search-results": { path: "search-results", label: "Search results" },
	"network-graph-visualisation": { path: "network-graph-visualisation", label: "Network graph" },
	"geo-map-visualisation": { path: "geo-map-visualisation", label: "Map (spatial coverage)" },
	"word-cloud-visualisation": { path: "word-cloud-visualisation", label: "Word cloud" },
};
</script>

<template>
	<div class="grid h-full grid-rows-[auto_auto_1fr]">
		<h1 class="sr-only">Search the data</h1>

		<aside>
			<div class="mx-auto w-full max-w-7xl px-8 py-4">
				<PassageSearchForm />
			</div>
		</aside>

		<nav aria-label="Passages" class="border-b border-neutral-200 shadow-lg">
			<ul
				class="mx-auto grid max-w-7xl grid-cols-2 items-center gap-x-8 gap-y-2 px-8 pt-4 text-sm font-medium md:grid-cols-4"
				role="list"
			>
				<li v-for="(link, key) of links" class="h-full flex items-center lg:items-end" :key="key">
					<NuxtLink
						class="flex justify-center rounded md:rounded-b-none w-full p-2 text-center transition hover:bg-neutral-100 aria-[current]:bg-neutral-200"
						:href="{ path: link.path, query }"
					>
						{{ link.label }}
					</NuxtLink>
				</li>
			</ul>
		</nav>

		<MainContent>
			<NuxtPage />
		</MainContent>

		<SidePanel />
	</div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { useCaseStudyById } from "@/api";
import MainContent from "@/components/main-content.vue";
import SidePanel from "@/components/side-panel.vue";
import { isNonEmptyString } from "@/lib/is-nonempty-string";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useResourceIdParam } from "@/lib/use-resource-id-param";
import { NuxtLink, NuxtPage } from "#components";
import { useHead } from "#imports";

const title = ref("Case study");

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const { createSearchFilterParams, searchFilters } = useSearchFilters();
const query = computed(() => {
	return createSearchFilterParams(searchFilters.value);
});

const _links = {
	timeline: { path: "timeline", label: "Timeline" },
	story: { path: "story", label: "Story" },
	"network-graph-visualisation": { path: "network-graph-visualisation", label: "Network graph" },
	"geo-map-visualisation": { path: "geo-map-visualisation", label: "Map (spatial coverage)" },
	"word-cloud-visualisation": { path: "word-cloud-visualisation", label: "Word cloud" },
	"texts-by-authors": { path: "texts-by-authors", label: "Texts by authors" },
};

const id = useResourceIdParam();
const caseStudyQuery = useCaseStudyById({ id });

const hasStory = computed(() => {
	return isNonEmptyString(caseStudyQuery.data.value?.story_map);
});

const links = computed(() => {
	/** Hide "Story" tab when case study does not have a story, to avoid 404 error message. */
	if (hasStory.value === true) return _links;
	const { story: _, ...links } = _links;
	return links;
});

watch(caseStudyQuery.data, (caseStudy) => {
	if (caseStudy?.title != null) {
		title.value = caseStudy.title;
	}
});
</script>

<template>
	<div class="grid h-full grid-rows-[auto_auto_1fr]">
		<div class="mx-auto grid w-full max-w-7xl gap-4 p-8">
			<h1 class="text-xl font-medium">{{ caseStudyQuery.data.value?.title ?? "Case study" }}</h1>
			<span class="font-medium text-neutral-600">
				{{ caseStudyQuery.data.value?.principal_investigator }}
			</span>
			<p class="text-sm leading-6">{{ caseStudyQuery.data.value?.description }}</p>
		</div>

		<nav aria-label="Case study" class="border-b border-neutral-200 shadow-lg">
			<ul
				class="mx-auto grid max-w-7xl grid-cols-3 items-center gap-x-8 gap-y-2 px-8 pt-4 text-sm font-medium"
				:class="hasStory ? 'lg:grid-cols-6' : 'lg:grid-cols-5'"
				role="list"
			>
				<li v-for="(link, key) of links" class="h-full flex items-center lg:items-end" :key="key">
					<NuxtLink
						class="flex w-full justify-center rounded lg:rounded-b-none p-2 text-center transition hover:bg-neutral-100 aria-[current]:bg-neutral-200"
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

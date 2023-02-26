<script lang="ts" setup>
import { computed } from "vue";

import { type Author } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import KeywordTag from "@/components/keyword-tag.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { createList } from "@/lib/create-list";
import { useAuthorDetails } from "@/lib/details/use-author-details";
import { getAuthorLabel, getPassageLabel } from "@/lib/get-label";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { NuxtLink } from "#components";

const props = defineProps<{
	id: Author["id"];
}>();

const id = computed(() => {
	return props.id;
});
const { createSearchFilterParams, searchFilters } = useSearchFilters();
const { caseStudies, keywords, passages, isLoading, isFetching, isEmpty, isError } =
	useAuthorDetails(id, searchFilters);
</script>

<template>
	<div>
		<template v-if="isLoading">
			<LoadingIndicator>Loading details...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load details.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating details...</LoadingIndicator>
			</template>

			<div class="grid gap-6">
				<section v-if="keywords.length > 0" class="grid gap-1">
					<h3 class="text-xs font-medium uppercase text-neutral-500">Keywords</h3>
					<ul class="flex flex-wrap gap-0.5" role="list">
						<li v-for="keyword of keywords" :key="keyword.id">
							<NuxtLink
								:href="{
									query: createSearchFilterParams({ ...searchFilters, keyword: [keyword.id] }),
								}"
							>
								<KeywordTag :keyword="keyword" />
							</NuxtLink>
						</li>
					</ul>
				</section>

				<section v-if="caseStudies.length > 0" class="grid gap-1">
					<h3 class="text-xs font-medium uppercase text-neutral-500">Case studies</h3>
					<ul role="list">
						<li v-for="caseStudy of caseStudies" :key="caseStudy.id">
							<articlce>
								<div>
									<NuxtLink
										class="transition hover:text-neutral-700"
										:href="{ path: `/case-studies/${caseStudy.id}/timeline` }"
									>
										{{ caseStudy.title }}
									</NuxtLink>
								</div>
								<div>{{ caseStudy.principal_investigator }}</div>
								<div>{{ caseStudy.description }}</div>
							</articlce>
						</li>
					</ul>
				</section>

				<section v-if="passages.length > 0" class="grid gap-1">
					<h3 class="text-xs font-medium uppercase text-neutral-500">Passages</h3>
					<ul role="list">
						<li v-for="passage of passages" :key="passage.id">
							<article>
								<div>
									<NuxtLink
										class="transition hover:text-neutral-700"
										:href="{
											query: createSearchFilterParams({ ...searchFilters, passage: [passage.id] }),
										}"
									>
										{{ getPassageLabel(passage) }}
									</NuxtLink>
								</div>
								<div v-if="passage.text">
									<div>{{ passage.text.title }}</div>
									<div>{{ createList(passage.text.autor.map(getAuthorLabel)) }}</div>
									<div>{{ passage.text.jahrhundert }}</div>
								</div>
							</article>
						</li>
					</ul>
				</section>
			</div>
		</template>
	</div>
</template>

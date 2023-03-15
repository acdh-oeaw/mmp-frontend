<script lang="ts" setup>
import { computed } from "vue";

import { type Place } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { useTextDetails } from "@/lib/details/use-text-details";
import { getPassageLabel } from "@/lib/get-label";
import { createResourceKey } from "@/lib/search/resource-key";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { NuxtLink } from "#components";

const props = defineProps<{
	id: Place["id"];
}>();

const id = computed(() => {
	return props.id;
});
const { searchFilters, createSearchFilterParams } = useSearchFilters();
const { createSelectionParams } = useSelection();

const { passages, caseStudies, isLoading, isFetching, isEmpty, isError } = useTextDetails(
	id,
	searchFilters,
);
</script>

<template>
	<div class="relative h-full w-full">
		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading details...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load details.</ErrorMessage>
			</Centered>
		</template>

		<template v-else-if="isEmpty">
			<Centered>
				<NothingFoundMessage></NothingFoundMessage>
			</Centered>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<Centered>
					<LoadingIndicator>Updating details...</LoadingIndicator>
				</Centered>
			</template>

			<div class="grid gap-6">
				<section v-if="passages.length > 0" class="grid gap-1">
					<h3 class="text-xs font-medium uppercase text-neutral-500">Passages</h3>
					<ul class="divide-y text-sm" role="list">
						<li v-for="passage of passages" :key="passage.id">
							<article>
								<div>
									<NuxtLink
										class="hover:underline"
										:href="{
											query: {
												...createSearchFilterParams(searchFilters),
												...createSelectionParams({
													selection: [createResourceKey({ kind: 'stelle', id: passage.id })],
												}),
											},
										}"
									>
										{{ getPassageLabel(passage) }}
									</NuxtLink>
								</div>
							</article>
						</li>
					</ul>
				</section>

				<section v-if="caseStudies.length > 0" class="grid gap-1">
					<h3 class="text-xs font-medium uppercase text-neutral-500">Case studies</h3>
					<ul class="divide-y text-sm" role="list">
						<li v-for="caseStudy of caseStudies" :key="caseStudy.id">
							<article class="grid gap-1">
								<NuxtLink class="hover:underline" :href="{ path: `/case-studies/${caseStudy.id}` }">
									<strong>{{ caseStudy.title }}</strong>
								</NuxtLink>
								<span>{{ caseStudy.principal_investigator }}</span>
								<p class="line-clamp-4">
									{{ caseStudy.description }}
								</p>
							</article>
						</li>
					</ul>
				</section>
			</div>
		</template>
	</div>
</template>

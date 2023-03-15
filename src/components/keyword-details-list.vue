<script lang="ts" setup>
import { computed } from "vue";

import { type Keyword } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { useKeywordDetails } from "@/lib/details/use-keyword-details";
import { getPassageLabel } from "@/lib/get-label";
import { createResourceKey } from "@/lib/search/resource-key";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { NuxtLink } from "#components";

const props = defineProps<{
	id: Keyword["id"];
}>();

const id = computed(() => {
	return props.id;
});

const { searchFilters, createSearchFilterParams } = useSearchFilters();
const { createSelectionParams } = useSelection();

const { passages, isLoading, isFetching, isEmpty, isError } = useKeywordDetails(id, searchFilters);
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
					<ul role="list" class="divide-y text-sm">
						<li v-for="passage of passages" :key="passage.id">
							<article class="grid gap-1 py-2">
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
								<ul role="list" class="flex flex-wrap gap-1 text-xs font-medium">
									<li v-for="keyword of passage.key_word" :key="keyword.id">
										<NuxtLink
											class="hover:underline"
											:href="{
												query: {
													...createSearchFilterParams(searchFilters),
													...createSelectionParams({
														selection: [createResourceKey({ kind: 'keyword', id: keyword.id })],
													}),
												},
											}"
										>
											<span class="inline-flex rounded bg-neutral-100 px-2 py-1 transition">
												{{ keyword.stichwort }}
											</span>
										</NuxtLink>
									</li>
								</ul>
							</article>
						</li>
					</ul>
				</section>
			</div>
		</template>
	</div>
</template>

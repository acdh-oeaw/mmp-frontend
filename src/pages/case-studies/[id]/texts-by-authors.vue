<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import KeywordTag from "@/components/keyword-tag.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { getAuthorLabel } from "@/lib/get-label";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useTextsByAuthors } from "@/lib/search/use-texts-by-authors";
import { useResourceIdParam } from "@/lib/use-resource-id-param";
import { NuxtLink } from "#components";
import { useHead } from "#imports";

const title = "Texts by authors";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const _id = useResourceIdParam();
/** Search filters already take case study id into account. */
const { createSearchFilterParams, defaultSearchFilters, searchFilters } = useSearchFilters();
const { data, isLoading, isError, isEmpty, isFetching } = useTextsByAuthors(searchFilters);
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Texts by authors</h2>

		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading passages...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load passages.</ErrorMessage>
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
					<LoadingIndicator>Updating passages...</LoadingIndicator>
				</Centered>
			</template>

			<div class="overflow-x-auto transition-all" :class="{ 'opacity-50 grayscale': isFetching }">
				<!-- TODO: some of those nested unordered lists could be definition lists. -->
				<ul rol="list" class="min-w-full divide-y divide-neutral-200 text-sm">
					<li
						v-for="[authorId, author] of data.authorsById"
						:key="authorId"
						class="grid gap-2 px-6 py-4 text-neutral-800"
					>
						<h3 class="text-base font-medium">{{ getAuthorLabel(author) }}</h3>

						<div class="text-xs font-medium uppercase text-neutral-500">
							{{ data.textIdsByAuthorId.get(authorId)?.size }} texts and
							{{ data.passageIdsByAuthorId.get(author.id)?.size }} passages
						</div>

						<ul role="list" class="my-1 grid gap-2">
							<li v-for="textId of data.textIdsByAuthorId.get(authorId)" :key="textId">
								<Disclosure as="div" class="grid gap-2">
									<DisclosureButton class="flex w-full items-center justify-between">
										<span>
											{{ data.textsById.get(textId)?.title }} ({{
												data.passageIdsByTextTd.get(textId)?.size
											}}
											passages)
										</span>
										<ChevronDownIcon class="h-5 w-5" />
									</DisclosureButton>
									<DisclosurePanel>
										<ul role="list" class="grid gap-4 px-4 pb-2">
											<li
												v-for="passageId of data.passageIdsByTextTd.get(textId)"
												:key="passageId"
												class="grid gap-1"
											>
												<NuxtLink
													:href="{
														path: '/explore/search-results',
														query: createSearchFilterParams({
															...defaultSearchFilters,
															passage: [passageId],
														}),
													}"
												>
													{{ data.passagesById.get(passageId)?.display_label }}
												</NuxtLink>

												<ul class="flex flex-wrap gap-0.5" role="list">
													<li
														v-for="keyword of data.passagesById.get(passageId)?.key_word"
														:key="keyword.id"
													>
														<NuxtLink
															:href="{
																path: '/explore/search-results',
																query: createSearchFilterParams({
																	...defaultSearchFilters,
																	keyword: [keyword.id],
																}),
															}"
														>
															<KeywordTag :keyword="keyword" />
														</NuxtLink>
													</li>
												</ul>
											</li>
										</ul>
									</DisclosurePanel>
								</Disclosure>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</template>
	</div>
</template>

<script lang="ts" setup>
import ErrorMessage from "@/components/error-message.vue";
import KeywordTag from "@/components/keyword-tag.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { useCaseStudyIdParam } from "@/lib/case-studies/use-case-study-id-param";
import { getAuthorLabel } from "@/lib/get-label";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useTextsByAuthors } from "@/lib/search/use-texts-by-authors";
import { NuxtLink } from "#components";
import { useHead } from "#imports";

const title = "Texts by authors";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const _id = useCaseStudyIdParam();
/** Search filters already take case study id into account. */
const { createSearchFilterParams, defaultSearchFilters, searchFilters } = useSearchFilters();
const { data, isLoading, isError, isEmpty, isFetching } = useTextsByAuthors(searchFilters);
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Texts by authors</h2>

		<template v-if="isLoading">
			<LoadingIndicator>Loading passages...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load passages.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating passages...</LoadingIndicator>
			</template>

			<!-- TODO: some of those nested unordered lists could be definition lists. -->
			<ul rol="list">
				<li v-for="[authorId, author] of data.authorsById" :key="authorId">
					<h3>{{ getAuthorLabel(author) }}</h3>

					<span>
						{{ data.textIdsByAuthorId.get(authorId)?.size }} texts and
						{{ data.passageIdsByAuthorId.get(author.id)?.size }} passages
					</span>

					<ul role="list">
						<li v-for="textId of data.textIdsByAuthorId.get(authorId)" :key="textId">
							<span>{{ data.textsById.get(textId)?.title }}</span>

							<span>{{ data.passageIdsByTextTd.get(textId)?.size }} passages</span>

							<ul role="list">
								<li v-for="passageId of data.passageIdsByTextTd.get(textId)" :key="passageId">
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

									<ul role="list">
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
						</li>
					</ul>
				</li>
			</ul>
		</template>
	</div>
</template>

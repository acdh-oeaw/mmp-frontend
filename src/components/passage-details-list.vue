<script lang="ts" setup>
import { computed } from "vue";

import { type Passage, usePassageById } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import KeywordTag from "@/components/keyword-tag.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { getAuthorLabel, getDateRangeLabel, getPlaceLabel } from "@/lib/get-label";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { NuxtLink } from "#components";

const props = defineProps<{
	id: Passage["id"];
}>();

const id = computed(() => {
	return props.id;
});
const { createSearchFilterParams, searchFilters } = useSearchFilters();
const passageQuery = usePassageById({ id });
const isLoading = passageQuery.isInitialLoading;
const isFetching = passageQuery.isFetching;
const isError = passageQuery.isError;
const passage = passageQuery.data;
const isEmpty = computed(() => {
	return passage.value == null;
});
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

			<section>
				<dl v-if="passage">
					<div>
						<dt>Keywords</dt>
						<dd>
							<ul class="flex flex-wrap gap-0.5" role="list">
								<li v-for="keyword of passage.key_word" :key="keyword.id">
									<NuxtLink
										:href="{
											query: createSearchFilterParams({ ...searchFilters, keyword: [keyword.id] }),
										}"
									>
										<KeywordTag :keyword="keyword" />
									</NuxtLink>
								</li>
							</ul>
						</dd>
					</div>
					<div v-if="passage.translation">
						<dt>Translation</dt>
						<dd>{{ passage.translation }}</dd>
					</div>
					<div v-if="passage.zitat">
						<dt>Original quote</dt>
						<dd>{{ passage.zitat }}</dd>
					</div>
					<div v-if="passage.text && passage.text.title">
						<dt>Ttile</dt>
						<dd>{{ passage.text.title }}</dd>
					</div>
					<div v-if="passage.zitat_stelle">
						<dt>Cited</dt>
						<dd>{{ passage.zitat_stelle }}</dd>
					</div>
					<div v-if="passage.summary">
						<dt>Summary</dt>
						<dd>{{ passage.summary }}</dd>
					</div>
					<div v-if="passage.text && passage.text.autor">
						<dt>Authors</dt>
						<dd>{{ passage.text.autor.map(getAuthorLabel).join(", ") }}</dd>
					</div>
					<div v-if="passage.text && passage.text.ort">
						<dt>Places</dt>
						<dd>{{ passage.text.ort.map(getPlaceLabel) }}</dd>
					</div>
					<div v-if="passage.text && passage.text.edition">
						<dt>Edition</dt>
						<dd>{{ passage.text.edition }}</dd>
					</div>
					<div v-if="passage.text">
						<dt>Date</dt>
						<dd>{{ getDateRangeLabel(passage.text.not_before, passage.text.not_after) }}</dd>
					</div>
					<div v-if="passage.kommentar">
						<dt>Comment</dt>
						<dd>{{ passage.kommentar }}</dd>
					</div>
				</dl>
			</section>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { type Passage, usePassageById } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import KeywordTag from "@/components/keyword-tag.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { createList } from "@/lib/create-list";
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

			<div class="grid gap-6">
				<section class="grid gap-1">
					<dl v-if="passage" class="grid gap-6">
						<div class="grid gap-1">
							<dt class="text-xs font-medium uppercase text-neutral-500">Keywords</dt>
							<dd>
								<ul class="flex flex-wrap gap-0.5" role="list">
									<li v-for="keyword of passage.key_word" :key="keyword.id">
										<NuxtLink
											:href="{
												query: createSearchFilterParams({
													...searchFilters,
													keyword: [keyword.id],
												}),
											}"
										>
											<KeywordTag :keyword="keyword" />
										</NuxtLink>
									</li>
								</ul>
							</dd>
						</div>
						<div v-if="passage.translation" class="grid gap-1">
							<dt class="text-xs font-medium uppercase text-neutral-500">Translation</dt>
							<dd>{{ passage.translation }}</dd>
						</div>
						<div v-if="passage.zitat" class="grid gap-1">
							<dt class="text-xs font-medium uppercase text-neutral-500">Original quote</dt>
							<dd>{{ passage.zitat }}</dd>
						</div>
						<div v-if="passage.text && passage.text.title" class="grid gap-1">
							<dt class="text-xs font-medium uppercase text-neutral-500">Ttile</dt>
							<dd>{{ passage.text.title }}</dd>
						</div>
						<div v-if="passage.zitat_stelle" class="grid gap-1">
							<dt class="text-xs font-medium uppercase text-neutral-500">Cited</dt>
							<dd>{{ passage.zitat_stelle }}</dd>
						</div>
						<div v-if="passage.summary" class="grid gap-1">
							<dt class="text-xs font-medium uppercase text-neutral-500">Summary</dt>
							<dd>{{ passage.summary }}</dd>
						</div>
						<div v-if="passage.text && passage.text.autor" class="grid gap-1">
							<dt class="text-xs font-medium uppercase text-neutral-500">Authors</dt>
							<dd>{{ createList(passage.text.autor.map(getAuthorLabel)) }}</dd>
						</div>
						<div v-if="passage.text && passage.text.ort" class="grid gap-1">
							<dt class="text-xs font-medium uppercase text-neutral-500">Places</dt>
							<dd>{{ createList(passage.text.ort.map(getPlaceLabel)) }}</dd>
						</div>
						<div v-if="passage.text && passage.text.edition" class="grid gap-1">
							<dt class="text-xs font-medium uppercase text-neutral-500">Edition</dt>
							<dd>{{ passage.text.edition }}</dd>
						</div>
						<div v-if="passage.text" class="grid gap-1">
							<dt class="text-xs font-medium uppercase text-neutral-500">Date</dt>
							<dd>{{ getDateRangeLabel(passage.text.not_before, passage.text.not_after) }}</dd>
						</div>
						<div v-if="passage.kommentar" class="grid gap-1">
							<dt class="text-xs font-medium uppercase text-neutral-500">Comment</dt>
							<dd>{{ passage.kommentar }}</dd>
						</div>
					</dl>
				</section>
			</div>
		</template>
	</div>
</template>

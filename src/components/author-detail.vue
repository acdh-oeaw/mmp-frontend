<script lang="ts" setup>
import { assert } from '@stefanprobst/assert';
import { computed } from 'vue';

import { useAuthorById, useCaseStudies, useKeywords, usePassages } from '@/api';
import { getAuthorLabel, getPlaceLabel } from '@/lib/get-label';
import { keywordColors } from '@/lib/search/search.config';
import { useDetailsSearchFilters } from '@/lib/search/use-details-search-filters';
import { useSearchFilters } from '@/lib/search/use-search-filters';

const {
	searchFilters: detailSearchFilters,
	createSearchFilterParams: createDetailSearchFilterParams,
} = useDetailsSearchFilters();
const id = computed(() => {
	assert(detailSearchFilters.value['detail-kind'] === 'author');
	const id = detailSearchFilters.value['detail-id'][0];
	assert(id != null);
	return id;
});
const { createSearchFilterParams, searchFilters } = useSearchFilters();

const authorByIdQuery = useAuthorById({ id });
const caseStudiesQuery = useCaseStudies({ has_stelle__text__autor: [id] });
const passagesQuery = usePassages({
	text__autor: [id],
	has_usecase: searchFilters.value.dataset === 'case-studies',
});
const keywordsQuery = useKeywords({
	rvn_stelle_key_word_keyword__text__autor: [id],
	has_usecase: searchFilters.value.dataset === 'case-studies',
});

const isLoading = computed(() => {
	return [authorByIdQuery, caseStudiesQuery, passagesQuery, keywordsQuery].some((query) => {
		return query.isInitialLoading.value;
	});
});

const author = computed(() => {
	return authorByIdQuery.data.value;
});
const caseStudies = computed(() => {
	return caseStudiesQuery.data.value?.results ?? [];
});
const caseStudiesCount = computed(() => {
	return caseStudiesQuery.data.value?.count;
});
const passages = computed(() => {
	return passagesQuery.data.value?.results ?? [];
});
const passagesCount = computed(() => {
	return passagesQuery.data.value?.count;
});
const keywords = computed(() => {
	return keywordsQuery.data.value?.results ?? [];
});
</script>

<template>
	<div>
		<VListItem>
			<VListItemAction>
				<RouterLink
					aria-label="Close panel"
					:to="{ query: createSearchFilterParams(searchFilters) }"
				>
					<VIcon>mdi-close</VIcon>
				</RouterLink>
			</VListItemAction>
			<VListItemContent>
				<div v-if="!isLoading && author">
					<VListItemTitle class="text-h5">
						{{ getAuthorLabel(author) }}
					</VListItemTitle>
					<VListItemSubtitle>
						{{ author.jahrhundert || 'Unknown century' }},
						{{ getPlaceLabel(author.ort) || 'Unknown place' }}
					</VListItemSubtitle>
					<VListItemSubtitle v-if="author.gnd_id">
						GND-ID:
						<a :href="'https://d-nb.info/gnd/' + author.gnd_id" rel="noreferrer" target="_blank">
							{{ author.gnd_id }} <v-icon small>mdi-open-in-new</v-icon>
						</a>
					</VListItemSubtitle>
				</div>

				<VSkeletonLoader v-else type="heading, text@2" />
			</VListItemContent>
		</VListItem>

		<VDivider />

		<VContainer>
			<div v-for="keyword of keywords" :key="keyword.id" class="keyword-chip">
				<VChip
					:color="keywordColors[keyword.art]"
					small
					:to="{
						name: 'explore-search-results',
						query: createSearchFilterParams({
							...searchFilters,
							keyword: [...searchFilters.keyword, keyword.id],
						}),
					}"
				>
					{{ keyword.stichwort }}
				</VChip>
			</div>

			<VExpansionPanels :value="[0, 1]" flat accordion multiple>
				<VExpansionPanel :disabled="!isLoading && !caseStudiesCount">
					<VExpansionPanelHeader>
						Use Cases
						<template #actions>
							<VChip small :disabled="!caseStudiesCount" color="amber lighten-3">
								{{ caseStudiesCount }}
							</VChip>
							<VIcon>mdi-chevron-down</VIcon>
						</template>
					</VExpansionPanelHeader>
					<VExpansionPanelContent>
						<VList v-if="!isLoading">
							<VListItem v-if="!caseStudiesCount">
								<VListItemContent>
									<VListItemTitle class="grey--text">None</VListItemTitle>
								</VListItemContent>
							</VListItem>
							<VListItem
								v-for="caseStudy of caseStudies"
								:key="caseStudy.id"
								three-line
								:to="{
									name: 'case-study-timeline',
									params: { id: caseStudy.id },
									query: createSearchFilterParams(searchFilters),
								}"
							>
								<VListItemContent>
									<VListItemTitle>{{ caseStudy.title }}</VListItemTitle>
									<VListItemSubtitle v-if="caseStudy.principal_investigator">
										{{ caseStudy.principal_investigator }}
									</VListItemSubtitle>
									<VListItemSubtitle v-if="caseStudy.description">
										{{ caseStudy.description }}
									</VListItemSubtitle>
								</VListItemContent>
								<VListItemIcon>
									<VIcon>mdi-chevron-right</VIcon>
								</VListItemIcon>
							</VListItem>
						</VList>

						<VList v-else>
							<VListItem>
								<VListItemContent>
									<VListItemTitle>
										<VSkeletonLoader type="sentences@7" />
									</VListItemTitle>
								</VListItemContent>
							</VListItem>
						</VList>
					</VExpansionPanelContent>
				</VExpansionPanel>

				<VExpansionPanel :disabled="!isLoading && !passagesCount">
					<VExpansionPanelHeader>
						Passages
						<template #actions>
							<VChip small :disabled="!passagesCount" color="teal lighten-4">
								{{ passagesCount }}
							</VChip>
							<VIcon>mdi-chevron-down</VIcon>
						</template>
					</VExpansionPanelHeader>
					<VExpansionPanelContent>
						<VList v-if="!isLoading">
							<VListItem v-if="!passagesCount">
								<VListItemContent>
									<VListItemTitle class="grey--text">none</VListItemTitle>
								</VListItemContent>
							</VListItem>
							<VListItem
								v-for="passage of passages"
								:key="passage.id"
								three-line
								:to="{
									name: 'explore-search-results',
									query: {
										...createSearchFilterParams(searchFilters),
										...createDetailSearchFilterParams({
											'detail-kind': 'passage',
											'detail-id': [passage.id],
										}),
									},
								}"
							>
								<VListItemContent>
									<VListItemTitle>{{ passage.display_label }}</VListItemTitle>
									<VListItemSubtitle v-if="passage.text?.autor.length">
										{{ passage.text.title }},
										{{ passage.text.autor.map(getAuthorLabel).join(', ') }}
									</VListItemSubtitle>
									<VListItemSubtitle v-if="passage.text?.jahrhundert">
										{{ passage.text.jahrhundert }} century
									</VListItemSubtitle>
								</VListItemContent>
								<VListItemIcon>
									<VIcon>mdi-chevron-right</VIcon>
								</VListItemIcon>
							</VListItem>
						</VList>

						<VList v-else>
							<VListItem>
								<VListItemContent>
									<VListItemTitle>
										<VSkeletonLoader type="sentences@7" />
									</VListItemTitle>
								</VListItemContent>
							</VListItem>
						</VList>
					</VExpansionPanelContent>
				</VExpansionPanel>
			</VExpansionPanels>
		</VContainer>
	</div>
</template>

<script lang="ts" setup>
import { useQueries } from '@tanstack/vue-query';
import { computed, ref } from 'vue';

import { createKey, usePassages } from '@/api';
import * as api from '@/api/client';
import GeoMapPlace from '@/components/geo-map-place.vue';
import KeywordAuthorTab from '@/components/keyword-author-tab.vue';
import KeywordOverTime from '@/components/keyword-over-time.vue';
import { isNotNullable } from '@/lib/is-not-nullable';
import { useDetailsSearchFilters } from '@/lib/search/use-details-search-filters';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { truncate } from '@/lib/truncate';
import { useStore } from '@/lib/use-store';

const store = useStore();
const { createSearchFilterParams, searchFilters } = useSearchFilters();
const { searchFilters: detailSearchFilters } = useDetailsSearchFilters();
const ids = computed(() => {
	if (detailSearchFilters.value['detail-kind'] !== 'keyword') return [];
	return detailSearchFilters.value['detail-id'];
});

const keywordQueries = useQueries({
	queries: computed(() => {
		return ids.value.map((id) => {
			return {
				queryKey: createKey('keyword', 'by-id', { id }),
				queryFn: () => {
					return api.getKeywordById({ id });
				},
			};
		});
	}),
});

const keywordByCenturyQueries = useQueries({
	queries: computed(() => {
		return ids.value.map((id) => {
			return {
				queryKey: createKey('keyword', 'by-id', { id }, 'century'),
				queryFn: () => {
					return api.getKeywordByCenturyById({ id });
				},
			};
		});
	}),
});

const passagesQuery = usePassages(
	computed(() => {
		return {
			[searchFilters.value['query-mode'] === 'intersection' ? 'key_word_and' : 'key_word']:
				ids.value,
			// has_usecase: searchFilters.value['dataset'] === 'case-studies',
			limit: 500, // FIXME: you already know
		};
	})
);

const isLoading = computed(() => {
	return (
		keywordQueries.value.some((query) => query.isInitialLoading) ||
		keywordByCenturyQueries.value.some((query) => query.isInitialLoading) ||
		passagesQuery.isInitialLoading.value
	);
});

const keywords = computed(() => {
	return keywordQueries.value.map((query) => query.data).filter(isNotNullable);
});
const keywordsByCentury = computed(() => {
	return keywordByCenturyQueries.value.map((query) => query.data).filter(isNotNullable);
});
const passages = computed(() => passagesQuery.data.value?.results ?? []);
const points = computed(() => {
	const points: Array<{ lat: number; lng: number }> = [];

	passages.value.forEach((passage) => {
		passage.text?.ort.forEach((place) => {
			if (place.lat != null && place.long != null) {
				points.push({ lat: place.lat, lng: place.long });
			}
		});
	});

	return points;
});

const passageCount = computed(() => passagesQuery.data.value?.count);

const tab = ref(null);

const neighbors = computed({
	get() {
		return store.state.graphOptions.showNeighborsOnly;
	},
	set(value) {
		store.commit('setGraphParam', { key: 'showNeighborsOnly', value });
	},
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
				<div v-if="!isLoading">
					<VListItemTitle class="text-h5">
						{{ keywords.map((keyword) => keyword.stichwort).join(', ') }}
					</VListItemTitle>
					<VListItemSubtitle>
						Mentioned in
						<RouterLink
							:to="{
								name: 'explore-search-results',
								query: createSearchFilterParams({ ...searchFilters, keyword: ids }),
							}"
						>
							<span v-if="passageCount">
								{{ passageCount }} passage{{ passageCount === 1 ? '' : 's' }}
								<VIcon small>mdi-link</VIcon>,
							</span>
						</RouterLink>
						<RouterLink
							:to="{
								query: createSearchFilterParams({ ...searchFilters, keyword: ids }),
							}"
						>
							show all connections<VIcon small>mdi-link</VIcon>
						</RouterLink>
					</VListItemSubtitle>
				</div>

				<VSkeletonLoader v-else type="heading, text" />
			</VListItemContent>
		</VListItem>

		<VDivider />

		<VContainer>
			<VCol>
				<VCheckbox
					v-model="neighbors"
					label="Only show keywords that are directly connected to selection"
				/>
			</VCol>

			<VRow>
				<VCol>
					<VTabs v-model="tab" grow background-color="transparent">
						<VTab key="Authors">Authors</VTab>
						<VTab key="Geography">Geography</VTab>
						<VTab key="Over Time">Over Time</VTab>
					</VTabs>
					<VTabsItems v-model="tab" background-color="transparent">
						<VTabItem key="Authors">
							<KeywordAuthorTab v-if="!isLoading" :passages="passages" />
							<VSkeletonLoader v-else type="text@10" />
						</VTabItem>
						<VTabItem key="Geography">
							<GeoMapPlace v-if="!isLoading" :points="points" />
							<VSkeletonLoader v-else type="image@2" />
						</VTabItem>
						<VTabItem key="Over Time">
							<KeywordOverTime v-if="!isLoading" :data="keywordsByCentury" />
							<VSkeletonLoader v-else type="image@2" />
						</VTabItem>
					</VTabsItems>
				</VCol>
			</VRow>

			<VRow>
				<VCol>
					<template v-if="!isLoading">
						<VRow>
							<VCol>
								<VBtn
									dark
									color="#171d3b"
									block
									class="detail-button"
									:to="{
										name: 'explore-search-results',
										query: createSearchFilterParams({ ...searchFilters, keyword: ids }),
									}"
								>
									{{
										truncate(
											`Show all Passages for ${keywords.map((x) => x.stichwort).join(', ')}`,
											40
										)
									}}
								</VBtn>
							</VCol>
						</VRow>

						<VRow>
							<VCol>
								<VBtn
									light
									outlined
									block
									class="detail-button"
									:to="{
										query: createSearchFilterParams({ ...searchFilters, keyword: ids }),
									}"
								>
									Show all Connections in Graph
								</VBtn>
							</VCol>
						</VRow>
					</template>

					<VSkeletonLoader v-else type="button@2" />
				</VCol>
			</VRow>
		</VContainer>
	</div>
</template>

<style>
button.v-expansion-panel-header {
	padding: 6px;
}

.detail-button {
	padding: 5px;
}

.fixed-bottom {
	position: fixed;
	bottom: 0;
	width: 100%;
}

.v-skeleton-loader__button {
	width: 100%;
}

.theme--light.v-expansion-panels .v-expansion-panel {
	background-color: transparent;
}

.theme--light.v-tabs-items {
	background-color: transparent;
}
</style>

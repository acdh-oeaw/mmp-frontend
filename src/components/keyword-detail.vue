<script lang="ts" setup>
import { useQueries } from '@tanstack/vue-query';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router/composables';

import { createKey, useKeywordGraph, usePassages } from '@/api';
import * as api from '@/api/client';
import GeoMapPlace from '@/components/geo-map-place.vue';
import KeywordAuthorTab from '@/components/keyword-author-tab.vue';
import KeywordListItem from '@/components/keyword-list-item.vue';
import KeywordOverTime from '@/components/keyword-over-time.vue';
import { isNotNullable } from '@/lib/is-not-nullable';
import { useDetailsSearchFilters } from '@/lib/search/use-details-search-filters';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { truncate } from '@/lib/truncate';
import { useStore } from '@/lib/use-store';

const route = useRoute();
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

const keywordGraphQuery = useKeywordGraph({ ids: ids.value.join(',') });

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
		[keywordGraphQuery, passagesQuery].some((query) => query.isInitialLoading.value)
	);
});

const keywords = computed(() => {
	return keywordQueries.value.map((query) => query.data).filter(isNotNullable);
});
const keywordsByCentury = computed(() => {
	return keywordByCenturyQueries.value.map((query) => query.data).filter(isNotNullable);
});
const keywordGraph = computed(() => keywordGraphQuery.data.value);
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

function getNumbersFromString(value: string) {
	return value.replace(/\D/g, '');
}

const connections = computed(() => {
	const retArr: any[] = [];

	if (!keywords.value || !keywordGraph.value) return retArr;

	// const keyIds = this.data.keywords.map((x) => x.id);
	const edges = keywordGraph.value.edges;

	// edges = this.removeDuplicates(edges, ['source', 'target']);

	const targets = edges.map((edge) => ({ target: edge.target, count: edge.count }));
	const count: Record<string, number> = {};

	targets.forEach((target) => {
		count[target.target] = (count[target.target] ?? 0) + target.count;
	});

	Object.entries(count).forEach(([target, count]) => {
		retArr.push({
			key: target,
			id: getNumbersFromString(target),
			label: keywordGraph.value?.nodes.find((node) => node.key === target)?.label,
			count,
		});
	});

	// priorise connections with keyword in query
	// return retArr.sort((a) => (route.query?.Keyword.split('+').includes(a.id) ? -1 : 1));

	// sort by connection count
	return retArr.sort((a, b) => b.count - a.count);
});

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
			<VListItemContent>
				<div v-if="!isLoading">
					<VListItemTitle class="text-h5">
						{{ keywords.map((x) => x.stichwort).join(', ') }}
					</VListItemTitle>
					<VListItemSubtitle>
						Mentioned in
						<RouterLink
							:to="{
								name: 'explore-search-results',
								query: createSearchFilterParams({ ...searchFilters, keyword: [id] }),
							}"
						>
							<span v-if="passageCount">
								{{ passageCount }} passage{{ passageCount === 1 ? '' : 's' }}
								<VIcon small>mdi-link</VIcon>,
							</span>
						</RouterLink>
						<RouterLink
							:to="{
								params: { id: route.params.id },
								query: createSearchFilterParams({ ...searchFilters, keyword: [id] }),
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
					<VExpansionPanels v-if="!isLoading" accordion flat>
						<VExpansionPanel v-for="conn in connections" :key="conn.id">
							<VExpansionPanelHeader>
								<span>
									{{ keywords.map((x) => x.stichwort).join(', ') }}
									<VIcon small>mdi-arrow-left-right</VIcon> {{ conn.label }}
								</span>
								<template #actions>
									<VChip small>{{ conn.count }} connections</VChip>
									<VIcon>mdi-chevron-down</VIcon>
								</template>
							</VExpansionPanelHeader>
							<VExpansionPanelContent>
								<KeywordListItem
									:parent-nodes="keywords.map((x) => x.id)"
									:sibling-node="conn.id"
								/>
							</VExpansionPanelContent>
						</VExpansionPanel>
					</VExpansionPanels>

					<VSkeletonLoader v-else type="list-item@5" class="transparent-skeleton" />
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
										query: createSearchFilterParams({
											...searchFilters,
											keyword: keywords.map((x) => x.id),
										}),
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
										params: { id: route.params.id },
										query: createSearchFilterParams({ ...searchFilters, keyword: [id] }),
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

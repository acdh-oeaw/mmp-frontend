<script lang="ts" setup>
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/vue";
import { useQueries } from "@tanstack/vue-query";
import { computed } from "vue";

import { type Author, type Keyword, createKey, useTexts } from "@/api";
import * as api from "@/api/client";
import AreaMap from "@/components/area-map.vue";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import GraphKeywordDetailsConnections from "@/components/graph-keyword-details-connections.vue";
import KeywordDetailsTextsByAuthors from "@/components/keyword-details-texts-by-authors.vue";
import LineChart from "@/components/line-chart.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import PlaceMap from "@/components/place-map.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import { createList } from "@/lib/create-list";
import { useGeoMap } from "@/lib/geo-map/use-geo-map";
import { getPlaceLabel } from "@/lib/get-label";
import { isNotNullable } from "@/lib/is-not-nullable";
import { useSearchFilters } from "@/lib/search/use-search-filters";

const props = defineProps<{
	ids: Set<Keyword["id"]>;
	authors?: Set<Author["id"]>;
}>();

const keywordsQueriesConfig = computed(() => {
	return Array.from(props.ids).map((id) => {
		const params = { id };

		return {
			queryKey: createKey("keyword", "by-id", params),
			queryFn() {
				return api.getKeywordById(params);
			},
		};
	});
});

const keywordsQueries = useQueries({ queries: keywordsQueriesConfig });

const centuryKeywordsQueriesConfig = computed(() => {
	return Array.from(props.ids).map((id) => {
		const params = { id };

		return {
			queryKey: createKey("keyword", "by-id", params, "century"),
			queryFn() {
				return api.getKeywordByCenturyById(params);
			},
		};
	});
});

const centuryKeywordsQueries = useQueries({ queries: centuryKeywordsQueriesConfig });

const textKeywordsQuery = useTexts({ rvn_stelle_text_text__key_word: Array.from(props.ids) });

const { searchFilters: _searchFilters } = useSearchFilters();
const searchFilters = computed(() => {
	return { ..._searchFilters.value, keyword: Array.from(props.ids) };
});
const {
	areas,
	areaCenterPoints,
	isLoading: isGeojsonLoading,
	isError: isGeojsonError,
	isFetching: isGeojsonFetching,
} = useGeoMap(searchFilters);

const isLoading = computed(() => {
	return (
		[...keywordsQueries, ...centuryKeywordsQueries].some((query) => {
			return query.isInitialLoading;
		}) ||
		textKeywordsQuery.isInitialLoading.value ||
		isGeojsonLoading.value
	);
});
const isFetching = computed(() => {
	return (
		[...keywordsQueries, ...centuryKeywordsQueries].some((query) => {
			return query.isFetching;
		}) ||
		textKeywordsQuery.isInitialLoading.value ||
		isGeojsonFetching.value
	);
});
const isError = computed(() => {
	return (
		[...keywordsQueries, ...centuryKeywordsQueries].some((query) => {
			return query.isError;
		}) ||
		textKeywordsQuery.isInitialLoading.value ||
		isGeojsonError.value
	);
});
const keywords = computed(() => {
	return keywordsQueries
		.map((query) => {
			return query.data;
		})
		.filter(isNotNullable);
});
const centuryKeywords = computed(() => {
	return centuryKeywordsQueries
		.map((query) => {
			return query.data;
		})
		.filter(isNotNullable);
});

const texts = textKeywordsQuery.data;

const isEmpty = computed(() => {
	return keywords.value.length === 0;
});
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-6 py-4">
		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading keyword...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load keyword.</ErrorMessage>
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
					<LoadingIndicator>Updating keyword...</LoadingIndicator>
				</Centered>
			</template>

			<div class="grid h-full grid-rows-[auto_auto_1fr] gap-4 p-4 text-neutral-800">
				<h2 class="text-lg font-medium">
					{{ createList(keywords.map((keyword) => keyword.stichwort)) }}
				</h2>

				<div>
					<TabGroup>
						<TabList
							as="ul"
							class="grid grid-cols-3 border-b border-neutral-200 px-8 font-medium"
							role="list"
						>
							<Tab
								v-for="label in [
									'Geographic distribution',
									'Temporal distribution',
									'Spatial coverage',
								]"
								:key="label"
								v-slot="{ selected }"
								as="li"
								class="grid"
							>
								<div
									class="grid cursor-pointer place-items-center rounded-t p-2 text-center text-sm transition hover:bg-neutral-100 aria-[current]:bg-neutral-200"
									:class="{ 'pointer-events-none bg-neutral-200': selected }"
								>
									<span>
										{{ label }}
									</span>
								</div>
							</Tab>
						</TabList>
						<TabPanels>
							<div class="h-80">
								<VisualisationContainer
									v-slot="{ width, height }"
									class="rounded-b rounded-t-none border border-t-0 border-neutral-200"
								>
									<TabPanel>
										<PlaceMap
											v-if="texts"
											:width="width"
											:height="height"
											:points="
												texts.results
													.map((text) => text.ort)
													.flat(1)
													.map((place) => ({
														label: getPlaceLabel(place),
														lat: Number(place.lat),
														lng: Number(place.long),
													}))
											"
										/>
									</TabPanel>
									<TabPanel>
										<LineChart
											:width="width"
											:height="height"
											:series="
												centuryKeywords.map((century) => ({
													name: century.title,
													data: century.data.map(([centuryName, weight]) => ({
														name: String(centuryName),
														weight,
													})),
												}))
											"
										/>
									</TabPanel>
									<TabPanel>
										<AreaMap
											v-if="areas.length > 0"
											:areas="areas"
											:area-center-points="areaCenterPoints"
											:height="height"
											:width="width"
										/>
										<Centered v-else>
											<NothingFoundMessage></NothingFoundMessage>
										</Centered>
									</TabPanel>
								</VisualisationContainer>
							</div>
						</TabPanels>
					</TabGroup>
				</div>

				<div class="h-full">
					<TabGroup>
						<TabList
							as="ul"
							class="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-8 gap-y-2 border-b border-neutral-200 px-8 pt-4 font-medium md:grid-cols-2"
							role="list"
						>
							<Tab
								v-for="label in ['Texts & Authors', 'Connections']"
								:key="label"
								v-slot="{ selected }"
								as="li"
							>
								<div
									class="flex cursor-pointer justify-center rounded-t p-2 text-center text-sm transition hover:bg-neutral-100 aria-[current]:bg-neutral-200"
									:class="{ 'bg-neutral-200': selected }"
								>
									<span>
										{{ label }}
									</span>
								</div>
							</Tab>
						</TabList>
						<TabPanels class="grid h-full py-2">
							<TabPanel>
								<KeywordDetailsTextsByAuthors :ids="props.ids" />
							</TabPanel>
							<TabPanel>
								<GraphKeywordDetailsConnections />
							</TabPanel>
						</TabPanels>
					</TabGroup>
				</div>
			</div>
		</template>
	</div>
</template>

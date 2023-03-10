<script lang="ts" setup>
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/vue";
import { useQueries } from "@tanstack/vue-query";
import { computed } from "vue";

import { type Keyword, createKey, useTexts } from "@/api";
import * as api from "@/api/client";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import KeywordDetailsConnections from "@/components/keyword-details-connections.vue";
import KeywordDetailsTextsByAuthors from "@/components/keyword-details-texts-by-authors.vue";
import LineChart from "@/components/line-chart.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import PlaceMap from "@/components/place-map.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import { createList } from "@/lib/create-list";
import { isNotNullable } from "@/lib/is-not-nullable";

import { getPlaceLabel } from "../lib/get-label";

const props = defineProps<{
	ids: Set<Keyword["id"]>;
}>();

const queries = computed(() => {
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

const keywordsQueries = useQueries({ queries });

const centuryQueries = computed(() => {
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

const centuryKeywordsQueries = useQueries({ queries: centuryQueries });

const textKeywordsQuery = useTexts({ rvn_stelle_text_text__key_word: Array.from(props.ids) });

const isLoading = computed(() => {
	return (
		[...keywordsQueries, ...centuryKeywordsQueries].some((query) => {
			return query.isInitialLoading;
		}) || textKeywordsQuery.isInitialLoading.value
	);
});
const isFetching = computed(() => {
	return (
		[...keywordsQueries, ...centuryKeywordsQueries].some((query) => {
			return query.isFetching;
		}) || textKeywordsQuery.isInitialLoading.value
	);
});
const isError = computed(() => {
	return (
		[...keywordsQueries, ...centuryKeywordsQueries].some((query) => {
			return query.isError;
		}) || textKeywordsQuery.isInitialLoading.value
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

			<div class="grid gap-4 p-4 text-neutral-800">
				<h2 class="text-lg font-medium">
					{{ createList(keywords.map((keyword) => keyword.stichwort)) }}
				</h2>
			</div>
			<h1 class="text-center">Distribution</h1>
			<TabGroup>
				<TabList
					as="ul"
					class="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-2 border-b border-neutral-200 px-8 pt-2 font-medium md:grid-cols-2"
					role="list"
				>
					<Tab
						v-for="label in ['Geographic', 'Temporal']"
						:key="label"
						v-slot="{ selected }"
						as="li"
					>
						<div
							class="flex cursor-pointer justify-center rounded-t p-2 transition hover:bg-neutral-100 aria-[current]:bg-neutral-200"
							:class="{ 'bg-neutral-200': selected }"
						>
							<span>
								{{ label }}
							</span>
						</div>
					</Tab>
				</TabList>
				<TabPanels>
					<div class="h-80">
						<VisualisationContainer v-slot="{ width, height }" class="rounded-b">
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
						</VisualisationContainer>
					</div>
				</TabPanels>
			</TabGroup>
			<TabGroup>
				<TabList
					as="ul"
					class="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-2 border-b border-neutral-200 px-8 pt-4 font-medium md:grid-cols-2"
					role="list"
				>
					<Tab
						v-for="label in ['Texts & Authors', 'Connections']"
						:key="label"
						v-slot="{ selected }"
						as="li"
					>
						<div
							class="flex cursor-pointer justify-center rounded-t p-2 transition hover:bg-neutral-100 aria-[current]:bg-neutral-200"
							:class="{ 'bg-neutral-200': selected }"
						>
							<span>
								{{ label }}
							</span>
						</div>
					</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<KeywordDetailsTextsByAuthors :ids="props.ids" />
					</TabPanel>
					<TabPanel>
						<KeywordDetailsConnections />
					</TabPanel>
				</TabPanels>
			</TabGroup>
		</template>
	</div>
</template>

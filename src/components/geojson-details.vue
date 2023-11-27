<script lang="ts" setup>
import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Tab,
	TabGroup,
	TabList,
	TabPanel,
	TabPanels,
} from "@headlessui/vue";
import { ChevronDownIcon, EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { useQueries } from "@tanstack/vue-query";
import { computed, inject } from "vue";

import { createKey, type LinesPointsGeojson, type SpatialCoverageGeojson } from "@/api";
import * as api from "@/api/client";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import GeojsonPassageMetadata from "@/components/geojson-passage-metadata.vue";
import KeywordTag from "@/components/keyword-tag.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { key } from "@/lib/geo-map/geo-map.context";
import { type ConeOriginGeojson } from "@/lib/geo-map/geo-map.types";
import { useGeoMap } from "@/lib/geo-map/use-geo-map";
import { getPassageLabel, getPlaceLabel } from "@/lib/get-label";
import { isNotNullable } from "@/lib/is-not-nullable";
import { createSelectionKey } from "@/lib/search/selection-key";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { NuxtLink } from "#components";

const props = defineProps<{
	areas: Set<SpatialCoverageGeojson["id"]> | undefined;
	collections: Set<LinesPointsGeojson["id"]> | undefined;
	points: Set<ConeOriginGeojson["id"]> | undefined;
}>();

const { createSearchFilterParams, searchFilters } = useSearchFilters();
const { createSelectionParams, selection } = useSelection();

const areasQueriesConfig = computed(() => {
	return Array.from(props.areas ?? []).map((id) => {
		const params = { id };

		return {
			queryKey: createKey("geojson-spatial-coverage", "by-id", params),
			queryFn() {
				return api.getSpatialCoverageGeojsonById(params);
			},
		};
	});
});

const areasQueries = useQueries({ queries: areasQueriesConfig });

const pointsQueriesConfig = computed(() => {
	return Array.from(props.points ?? []).map((id) => {
		const params = { id };

		return {
			queryKey: createKey("place", "by-id", params),
			queryFn() {
				return api.getPlaceById(params);
			},
		};
	});
});

const pointsQueries = useQueries({ queries: pointsQueriesConfig });

const collectionsQueriesConfig = computed(() => {
	return Array.from(props.collections ?? []).map((id) => {
		const params = { id };

		return {
			queryKey: createKey("geojson-lines-points", "by-id", params),
			queryFn() {
				return api.getLinesPointsGeojsonById(params);
			},
		};
	});
});

const collectionsQueries = useQueries({ queries: collectionsQueriesConfig });

const isLoading = computed(() => {
	return [...areasQueries, ...pointsQueries, ...collectionsQueries].some((query) => {
		return query.isInitialLoading;
	});
});
const isFetching = computed(() => {
	return [...areasQueries, ...pointsQueries, ...collectionsQueries].some((query) => {
		return query.isFetching;
	});
});
const isError = computed(() => {
	return [...areasQueries, ...pointsQueries, ...collectionsQueries].some((query) => {
		return query.isError;
	});
});
const areasSetup = computed(() => {
	return areasQueries
		.map((query) => {
			return query.data;
		})
		.filter(isNotNullable);
});
const pointsSetup = computed(() => {
	return pointsQueries
		.map((query) => {
			return query.data;
		})
		.filter(isNotNullable);
});
const collectionsSetup = computed(() => {
	return collectionsQueries
		.map((query) => {
			return query.data;
		})
		.filter(isNotNullable);
});
const isEmpty = computed(() => {
	return (
		areasSetup.value.length === 0 &&
		pointsSetup.value.length === 0 &&
		collectionsSetup.value.length === 0
	);
});

function deselect<T>(selection: Array<T>, value: T): Array<T> {
	return selection.filter((key) => {
		return key !== value;
	});
}

//

// TODO: loading states
const { areas: _allAreas } = useGeoMap(searchFilters);
const allAreas = computed(() => {
	const sorted = [..._allAreas.value].sort((a, z) => {
		if (a.properties.key_word == null) return -1;
		if (z.properties.key_word == null) return 1;
		return a.properties.key_word.stichwort.localeCompare(z.properties.key_word.stichwort);
	});
	return sorted;
});

function onToggleAreaVisibility(id: SpatialCoverageGeojson["id"]) {
	if (context == null) return;

	const values = new Set(context.disabled.areas.value);

	if (values.has(id)) {
		values.delete(id);
	} else {
		values.add(id);
	}

	context.disabled.areas.value = values;
}

function onSetAreasVisibility(isVisible: boolean) {
	if (context == null) return;

	if (isVisible) {
		context.disabled.areas.value = new Set();
	} else {
		context.disabled.areas.value = new Set(
			allAreas.value.map((area) => {
				return area.id;
			}),
		);
	}
}

//

const context = inject(key);
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-6 py-4">
		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading geojson data...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load geojson data.</ErrorMessage>
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
					<LoadingIndicator>Updating geojson data...</LoadingIndicator>
				</Centered>
			</template>

			<div>
				<TabGroup>
					<TabList
						as="ul"
						class="grid grid-cols-2 gap-4 border-b border-neutral-200 px-8 font-medium"
						role="list"
					>
						<Tab v-slot="{ selected }" as="li">
							<div
								class="grid cursor-pointer place-items-center rounded-t p-2 text-center text-sm transition hover:bg-neutral-100 aria-[current]:bg-neutral-200"
								:class="{ 'pointer-events-none bg-neutral-200': selected }"
							>
								<span>Selected</span>
							</div>
						</Tab>
						<Tab v-slot="{ selected }" as="li">
							<div
								class="grid cursor-pointer place-items-center rounded-t p-2 text-center text-sm transition hover:bg-neutral-100 aria-[current]:bg-neutral-200"
								:class="{ 'pointer-events-none bg-neutral-200': selected }"
							>
								<span>All</span>
							</div>
						</Tab>
					</TabList>

					<TabPanels>
						<TabPanel>
							<section v-if="areasSetup.length > 0">
								<h2 class="sr-only flex border-b border-neutral-200 pb-1 text-xl font-medium">
									Spatial coverages
								</h2>
								<ul role="list" class="divide-y">
									<li v-for="area of areasSetup" :key="area.id">
										<article class="relative my-8 grid gap-2">
											<NuxtLink
												class="absolute right-2.5 flex items-center gap-1"
												:href="{
													query: {
														...createSearchFilterParams(searchFilters),
														...createSelectionParams({
															selection: deselect(
																selection.selection,
																createSelectionKey({ kind: 'geojson-area', id: area.id }),
															),
														}),
													},
												}"
											>
												<XMarkIcon class="h-4 w-4 shrink-0" />
												<span class="sr-only">Deselect</span>
											</NuxtLink>
											<h3 class="pr-8 text-lg font-medium">
												{{ area.properties.key_word?.stichwort }} ({{
													area.properties.key_word?.art
												}})
											</h3>
											<div>
												<KeywordTag
													v-if="area.properties.key_word"
													:keyword="area.properties.key_word"
												/>
											</div>
											<p class="text-sm leading-6">{{ area.properties.kommentar }}</p>
											<dl class="grid gap-2">
												<div class="flex gap-1 text-xs text-neutral-500">
													<dt>Degree of uncertainty:</dt>
													<dd>{{ area.properties.fuzzyness }}</dd>
												</div>
												<div class="grid gap-1">
													<dt class="text-sm font-medium uppercase text-neutral-600">Passages</dt>
													<dd class="text-sm">
														<ul class="divide-y divide-neutral-200" role="list">
															<li v-for="passage of area.properties.stelle" :key="passage.id">
																<Disclosure v-slot="{ open }">
																	<DisclosureButton
																		class="grid grid-cols-[1fr_auto] gap-2 rounded p-1 transition hover:bg-neutral-100"
																	>
																		<span class="text-left">{{ getPassageLabel(passage) }}</span>
																		<ChevronDownIcon
																			class="h-4 w-4 shrink-0 transition"
																			:class="open && 'rotate-180'"
																		/>
																	</DisclosureButton>
																	<DisclosurePanel
																		class="max-h-96 overflow-auto p-1 text-xs text-neutral-500"
																	>
																		<GeojsonPassageMetadata :id="passage.id" />
																	</DisclosurePanel>
																</Disclosure>
															</li>
														</ul>
													</dd>
												</div>
											</dl>
										</article>
									</li>
								</ul>
							</section>

							<section v-if="pointsSetup.length > 0">
								<h2 class="sr-only flex border-b border-neutral-200 pb-1 text-xl font-medium">
									Places
								</h2>
								<ul role="list" class="divide-y">
									<li v-for="point of pointsSetup" :key="point.id">
										<article class="relative my-8 grid gap-2">
											<NuxtLink
												class="absolute right-2.5 flex items-center gap-1"
												:href="{
													query: {
														...createSearchFilterParams(searchFilters),
														...createSelectionParams({
															selection: deselect(
																selection.selection,
																createSelectionKey({ kind: 'geojson-point', id: point.id }),
															),
														}),
													},
												}"
											>
												<XMarkIcon class="h-4 w-4 shrink-0" />
												<span class="sr-only">Deselect</span>
											</NuxtLink>
											<h3 class="pr-8 text-lg font-medium">
												{{ getPlaceLabel(point) }}
											</h3>
											<p class="text-sm leading-6">{{ point.kommentar }}</p>
										</article>
									</li>
								</ul>
							</section>

							<section v-if="collectionsSetup.length > 0">
								<h2 class="sr-only flex border-b border-neutral-200 pb-1 text-xl font-medium">
									Contextual data
								</h2>
								<ul role="list" class="divide-y">
									<li v-for="collection of collectionsSetup" :key="collection.id">
										<article class="relative my-8 grid gap-2">
											<NuxtLink
												class="absolute right-2.5 flex items-center gap-1"
												:href="{
													query: {
														...createSearchFilterParams(searchFilters),
														...createSelectionParams({
															selection: deselect(
																selection.selection,
																createSelectionKey({
																	kind: 'geojson-collection',
																	id: collection.id,
																}),
															),
														}),
													},
												}"
											>
												<XMarkIcon class="h-4 w-4 shrink-0" />
												<span class="sr-only">Deselect</span>
											</NuxtLink>
											<h3 class="pr-8 text-lg font-medium">
												{{ collection.properties.key_word?.stichwort }} ({{
													collection.properties.key_word?.art
												}})
											</h3>
											<div>
												<KeywordTag
													v-if="collection.properties.key_word"
													:keyword="collection.properties.key_word"
												/>
											</div>
											<p class="text-sm leading-6">{{ collection.properties.kommentar }}</p>
											<dl>
												<div class="grid gap-1">
													<dt class="text-sm font-medium uppercase text-neutral-600">Passages</dt>
													<dd class="text-sm">
														<ul role="list">
															<li v-for="passage of collection.properties.stelle" :key="passage.id">
																{{ getPassageLabel(passage) }}
															</li>
														</ul>
													</dd>
												</div>
											</dl>
										</article>
									</li>
								</ul>
							</section>
						</TabPanel>

						<TabPanel>
							<div class="mt-8 flex justify-center gap-4">
								<button
									class="flex items-center gap-1 rounded px-4 py-2 text-sm transition hover:bg-neutral-100"
									@click="onSetAreasVisibility(false)"
								>
									<EyeSlashIcon class="h-5 w-5 shrink-0" />
									<span>Hide all</span>
								</button>
								<button
									class="flex items-center gap-1 rounded px-4 py-2 text-sm transition hover:bg-neutral-100"
									@click="onSetAreasVisibility(true)"
								>
									<EyeIcon class="h-5 w-5 shrink-0" />
									<span>Show all</span>
								</button>
							</div>
							<ul role="list" class="divide-y divide-neutral-200 py-4 text-sm">
								<li
									v-for="area of allAreas"
									:key="area.id"
									class="flex items-center justify-between gap-4 py-4"
								>
									<div class="grid gap-2">
										<span>
											{{ area.properties.key_word?.stichwort }} ({{
												area.properties.key_word?.art
											}})
										</span>
										<ul role="list" class="grid gap-1 text-xs text-neutral-500">
											<li v-for="passage of area.properties.stelle" :key="passage.id">
												{{ getPassageLabel(passage) }}
											</li>
										</ul>
									</div>
									<button @click="onToggleAreaVisibility(area.id)">
										<EyeSlashIcon
											v-if="context?.disabled.areas.value.has(area.id)"
											class="h-5 w-5 shrink-0"
										/>
										<EyeIcon v-else class="h-5 w-5 shrink-0" />
										<span class="sr-only">Toggle visibility</span>
									</button>
								</li>
							</ul>
						</TabPanel>
					</TabPanels>
				</TabGroup>
			</div>
		</template>
	</div>
</template>

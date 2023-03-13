<script lang="ts" setup>
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { useQueries } from "@tanstack/vue-query";
import { computed } from "vue";

import { type LinesPointsGeojson, type SpatialCoverageGeojson, createKey } from "@/api";
import * as api from "@/api/client";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import KeywordTag from "@/components/keyword-tag.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { type ConeOriginGeojson } from "@/lib/geo-map/geo-map.types";
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
const areas = computed(() => {
	return areasQueries
		.map((query) => {
			return query.data;
		})
		.filter(isNotNullable);
});
const points = computed(() => {
	return pointsQueries
		.map((query) => {
			return query.data;
		})
		.filter(isNotNullable);
});
const collections = computed(() => {
	return collectionsQueries
		.map((query) => {
			return query.data;
		})
		.filter(isNotNullable);
});
const isEmpty = computed(() => {
	return areas.value.length === 0 && points.value.length === 0 && collections.value.length === 0;
});

function deselect<T>(selection: Array<T>, value: T): Array<T> {
	return selection.filter((key) => {
		return key !== value;
	});
}
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
				<section v-if="areas.length > 0">
					<h2 class="flex border-b border-neutral-200 pb-1 text-xl font-medium">
						Spatial coverages
					</h2>
					<ul role="list" class="divide-y">
						<li v-for="area of areas" :key="area.id">
							<article class="relative my-8 grid gap-2">
								<NuxtLink
									class="absolute right-0 flex items-center gap-1"
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
									{{ area.properties.key_word?.stichwort }} ({{ area.properties.key_word?.art }})
								</h3>
								<div>
									<KeywordTag v-if="area.properties.key_word" :keyword="area.properties.key_word" />
								</div>
								<p class="text-sm leading-6">{{ area.properties.kommentar }}</p>
								<dl>
									<div class="grid gap-1">
										<dt class="text-sm font-medium uppercase text-neutral-600">Passages</dt>
										<dd class="text-sm">
											<ul role="list">
												<li v-for="passage of area.properties.stelle" :key="passage.id">
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

				<section v-if="points.length > 0">
					<h2 class="flex border-b border-neutral-200 pb-1 text-xl font-medium">Places</h2>
					<ul role="list" class="divide-y">
						<li v-for="point of points" :key="point.id">
							<article class="relative my-8 grid gap-2">
								<NuxtLink
									class="absolute right-0 flex items-center gap-1"
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

				<section v-if="collections.length > 0">
					<h2 class="flex border-b border-neutral-200 pb-1 text-xl font-medium">Collections</h2>
					<ul role="list" class="divide-y">
						<li v-for="collection of collections" :key="collection.id">
							<article class="relative my-8 grid gap-2">
								<NuxtLink
									class="absolute right-0 flex items-center gap-1"
									:href="{
										query: {
											...createSearchFilterParams(searchFilters),
											...createSelectionParams({
												selection: deselect(
													selection.selection,
													createSelectionKey({ kind: 'geojson-collection', id: collection.id }),
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
			</div>
		</template>
	</div>
</template>

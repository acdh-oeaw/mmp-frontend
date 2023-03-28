<script lang="ts" setup>
import { ChevronRightIcon, ChevronUpDownIcon } from "@heroicons/vue/24/outline";

import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { useNetworkGraph } from "@/lib/network-graph/use-network-graph";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { SelectionKey } from "~~/src/lib/search/selection-key";

const { searchFilters, defaultSearchFilters, createSearchFilterParams } = useSearchFilters();
const { graph, isLoading, isError, isEmpty, isFetching } = useNetworkGraph(searchFilters);
const { selection } = useSelection();
</script>

<template>
	<div class="relative h-full w-full">
		<h2 class="sr-only">Texts by authors</h2>

		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading passages...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load passages.</ErrorMessage>
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
					<LoadingIndicator>Updating passages...</LoadingIndicator>
				</Centered>
			</template>

			<div class="overflow-x-auto transition-all" :class="{ 'opacity-50 grayscale': isFetching }">
				<ul v-if="graph">
					<li
						v-for="[key, conn] in Array.from(graph.edges)
							.filter(([key, edge]) => {
								return (
									selection.selection.includes('graph-' + edge.source as SelectionKey) ||
									selection.selection.includes('graph-' + edge.target as SelectionKey)
								);
							})
							.sort(([aKey, aValue], [bKey, bValue]) => {
								return bValue.count - aValue.count;
							})"
						:key="key"
					>
						<NuxtLink
							class="my-1 flex justify-between rounded p-2 transition hover:bg-black/10"
							:href="{
								path: '/explore/search-results',
								query: createSearchFilterParams({
									...defaultSearchFilters,
									keyword: [
										Number(graph.nodes.get(conn.source)?.id),
										Number(graph.nodes.get(conn.target)?.id),
									],
									offset: 0,
								}),
							}"
						>
							<div>
								{{ graph.nodes.get(conn.source)?.label }}
								<ChevronUpDownIcon class="inline h-5 w-5 rotate-90" />
								{{ graph.nodes.get(conn.target)?.label }}
							</div>
							<div class="flex min-w-fit items-center justify-center pl-1">
								{{ conn.count }}
								<ChevronRightIcon class="inline h-5 w-5" />
							</div>
						</NuxtLink>
					</li>
					<span class="text-sm italic text-gray-500">
						Note: These are only connections that are shown in the graph right now.
					</span>
				</ul>
			</div>
		</template>
	</div>
</template>

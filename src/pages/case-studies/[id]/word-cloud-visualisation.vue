<script lang="ts" setup>
import { ChartPieIcon, CloudIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import OverlayPanel from "@/components/overlay-panel.vue";
import OverlayPanelButton from "@/components/overlay-panel-button.vue";
import TokenPieCharts from "@/components/token-pie-charts.vue";
import TokenWordClouds from "@/components/token-word-clouds.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import { useCaseStudyIdParam } from "@/lib/case-studies/use-case-study-id-param";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useWordClouds } from "@/lib/word-cloud/use-word-clouds";
import { ClientOnly } from "#components";
import { useHead } from "#imports";

const title = "Word-cloud visualisation";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const _id = useCaseStudyIdParam();

const { searchFilters } = useSearchFilters();
const { clouds, isEmpty, isError, isFetching, isLoading } = useWordClouds(searchFilters);

const type = ref<"pie-chart" | "word-cloud">("word-cloud");
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Word-clouds visualisation</h2>

		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading word clouds...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load word clouds.</ErrorMessage>
			</Centered>
		</template>

		<template v-else-if="isEmpty">
			<Centered>
				<NothingFoundMessage></NothingFoundMessage>
			</Centered>
		</template>

		<template v-else>
			<ClientOnly>
				<template #fallback>
					<Centered>
						<LoadingIndicator>Loading word clouds...</LoadingIndicator>
					</Centered>
				</template>

				<template v-if="isFetching">
					<Centered>
						<LoadingIndicator>Updating word clouds...</LoadingIndicator>
					</Centered>
				</template>

				<VisualisationContainer
					v-slot="{ width, height }"
					class="rounded transition-all"
					:class="{ 'opacity-50 grayscale': isFetching }"
				>
					<TokenPieCharts
						v-if="type === 'pie-chart'"
						:height="height"
						:charts="clouds"
						:width="width"
					/>
					<TokenWordClouds
						v-else-if="type === 'word-cloud'"
						:height="height"
						:clouds="clouds"
						:width="width"
					/>
					<OverlayPanel position="top left">
						<OverlayPanelButton
							v-if="type === 'pie-chart'"
							aria-label="Word Cloud"
							@click="type = 'word-cloud'"
						>
							<CloudIcon class="h-5 w-5" />
						</OverlayPanelButton>
						<OverlayPanelButton
							v-else-if="type === 'word-cloud'"
							aria-label="Pie Chart"
							@click="type = 'pie-chart'"
						>
							<ChartPieIcon class="h-5 w-5" />
						</OverlayPanelButton>
					</OverlayPanel>
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>

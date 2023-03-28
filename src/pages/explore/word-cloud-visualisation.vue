<script lang="ts" setup>
import { ref } from "vue";

import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import TokenPieCharts from "@/components/token-pie-charts.vue";
import TokenWordClouds from "@/components/token-word-clouds.vue";
import ViewMode from "@/components/view-mode.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import WordCloudToolbar from "@/components/word-cloud-toolbar.vue";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useWordClouds } from "@/lib/word-cloud/use-word-clouds";
import { ClientOnly } from "#components";
import { useHead } from "#imports";

const title = "Word-cloud visualisation";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const { searchFilters } = useSearchFilters();
const { clouds, isEmpty, isError, isFetching, isLoading } = useWordClouds(searchFilters);

const type = ref<"pie-chart" | "word-cloud">("word-cloud");

function onToggle(chart: "pie-chart" | "word-cloud") {
	type.value = chart;
}
</script>

<template>
	<div class="relative mx-auto h-full w-full">
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
					<Centered class="z-10">
						<LoadingIndicator>Updating word clouds...</LoadingIndicator>
					</Centered>
				</template>

				<ViewMode>
					<VisualisationContainer
						v-slot="{ width, height }"
						class="min-h-[600px] transition-all"
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
						<WordCloudToolbar :type="type" :clouds="clouds" @toggle="onToggle" />
					</VisualisationContainer>
				</ViewMode>
			</ClientOnly>
		</template>
	</div>
</template>

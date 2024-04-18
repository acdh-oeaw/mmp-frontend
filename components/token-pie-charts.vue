<script lang="ts" setup>
import PieChart from "@/components/pie-chart.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import type { Token } from "@/lib/charts/pie-chart.types";

const props = defineProps<{
	charts: { tokens: Array<Token>; keywords: Array<Token> };
	height: number;
	width: number;
}>();
</script>

<template>
	<div class="absolute inset-0 grid grid-cols-2 gap-8 px-8 py-12" data-pie-charts>
		<div class="grid size-full grid-rows-[auto_1fr]">
			<span class="mt-8 text-center font-medium">Keywords</span>
			<VisualisationContainer v-slot="{ width, height }">
				<PieChart :chart="props.charts.keywords" :height="height" :width="width" />
			</VisualisationContainer>
		</div>
		<div>
			<span class="mt-8 text-center font-medium">All words</span>
			<VisualisationContainer v-slot="{ width, height }">
				<PieChart :chart="props.charts.tokens" :height="height" :width="width" />
			</VisualisationContainer>
		</div>
	</div>
</template>

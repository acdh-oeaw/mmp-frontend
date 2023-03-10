<script lang="ts" setup>
import PieChart from "@/components/pie-chart.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import { type Token } from "@/lib/charts/pie-chart.types";

const props = defineProps<{
	charts: { tokens: Array<Token>; keywords: Array<Token> };
	height: number;
	width: number;
}>();
</script>

<template>
	<div class="absolute inset-0 grid grid-cols-2" data-pie-charts>
		<VisualisationContainer v-slot="{ width, height }" class="rounded">
			<PieChart :chart="props.charts.keywords" :height="height" :width="width" />
		</VisualisationContainer>
		<VisualisationContainer v-slot="{ width, height }" class="rounded">
			<PieChart :chart="props.charts.tokens" :height="height" :width="width" />
		</VisualisationContainer>
	</div>
</template>

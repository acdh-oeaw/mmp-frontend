<script lang="ts" setup>
import { schemeCategory10 } from "d3";
import { type Chart, type SeriesOptionsType } from "highcharts";
import * as Highcharts from "highcharts";
import ChartAccessibility from "highcharts/modules/accessibility";
import { nextTick, onMounted, onUnmounted, provide, ref, watch } from "vue";

import { key } from "@/lib/charts/pie-chart.context";
import { type PieChartContext, type Token } from "@/lib/charts/pie-chart.types";
import { debounce } from "@/lib/debounce";

ChartAccessibility(Highcharts);

const props = defineProps<{
	chart: Array<Token>;
	height: number;
	title?: string;
	width: number;
}>();

const emit = defineEmits<{
	(event: "ready", chart: Chart): void;
}>();

const context: PieChartContext = {
	chart: null,
};

const elementRef = ref<HTMLElement | null>(null);

function createSeries(): Array<SeriesOptionsType> {
	return [
		{
			name: "Occurrences",
			data: props.chart.map((token) => {
				return { name: token.name, y: token.weight };
			}),
			type: "pie",
		},
	];
}

onMounted(() => {
	if (elementRef.value == null) return;

	context.chart = Highcharts.chart(elementRef.value, {
		chart: { width: props.width, height: props.height, backgroundColor: "transparent" },
		colors: [...schemeCategory10],
		// TODO: check if license allows to hide this
		// credits: { enabled: false },
		legend: { enabled: false },
		series: createSeries(),
		title: { text: props.title },
		tooltip: { pointFormat: "Occurences: {point.y}" },
		// plotOptions: {
		// 	pie: {
		// 		allowPointSelect: true,
		// 		cursor: "pointer",
		// 		dataLabels: {
		// 			enabled: true,
		// 			format: "<b>{point.name}</b>: {point.y}",
		// 		},
		// 	},
		// },
	});

	emit("ready", context.chart);
});

const resize = debounce((width: number, height: number) => {
	if (context.chart == null) return;

	nextTick(() => {
		context.chart?.setSize(width, height);
		// context.chart?.reflow();
	});
});

watch(
	[
		() => {
			return props.width;
		},
		() => {
			return props.height;
		},
	],
	([width, height]) => {
		resize(width, height);
	},
);

watch(
	() => {
		return props.chart;
	},
	() => {
		context.chart?.update({ series: createSeries() });
	},
);

onUnmounted(() => {
	context.chart?.destroy();
});

provide(key, context);
</script>

<template>
	<div ref="elementRef" class="absolute inset-0 grid" data-pie-chart />
	<slot :context="context" />
</template>

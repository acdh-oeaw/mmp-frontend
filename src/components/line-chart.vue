<script lang="ts" setup>
import { schemeCategory10 } from "d3";
import { type Chart, type SeriesOptionsType } from "highcharts";
import * as Highcharts from "highcharts";
import ChartAccessibility from "highcharts/modules/accessibility";
import { nextTick, onMounted, onUnmounted, provide, ref, watch } from "vue";

import { key } from "@/lib/charts/line-chart.context";
import { type LineChartContext, type Token } from "@/lib/charts/line-chart.types";
import { debounce } from "@/lib/debounce";

ChartAccessibility(Highcharts);

const props = defineProps<{
	height: number;
	series: Array<{ name: string; data: Array<Token> }>;
	title?: string;
	width: number;
}>();

const emit = defineEmits<{
	(event: "ready", chart: Chart): void;
}>();

const context: LineChartContext = {
	chart: null,
};

const elementRef = ref<HTMLElement | null>(null);

function createSeries(): Array<SeriesOptionsType> {
	return props.series.map((series) => {
		return {
			name: series.name,
			data: series.data.map((data) => {
				return data.weight;
			}),
			type: "line",
		};
	});
}

onMounted(() => {
	if (elementRef.value == null) return;

	context.chart = Highcharts.chart(elementRef.value, {
		chart: { width: props.width, height: props.height, backgroundColor: "transparent" },
		colors: [...schemeCategory10],
		// TODO: check if license allows to hide this
		// credits: { enabled: false },
		legend: { verticalAlign: "top" },
		series: createSeries(),
		title: { text: props.title },
		xAxis: {
			tickInterval: 3,
			categories: [
				"3rd BCE",
				"2nd BCE",
				"1st BCE",
				"1st CE",
				"2nd CE",
				"3rd CE",
				"4th CE",
				"5th CE",
				"6th CE",
				"7th CE",
				"8th CE",
				"9th CE",
				"10th CE",
				"11th CE",
				"12th CE",
				"13th CE",
				"14th CE",
				"15th CE",
				"16th CE",
			],
		},
		tooltip: { pointFormat: "Occurences: {point.y}" },

		yAxis: {
			title: {
				text: "",
			},
			tickInterval: 1,
		},
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
		return props.series;
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
	<div ref="elementRef" class="absolute inset-0 grid" data-word-cloud />
	<slot :context="context" />
</template>

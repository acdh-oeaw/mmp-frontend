<script lang="ts" setup>
import { schemeCategory10 } from "d3";
import { type Chart } from "highcharts";
import * as Highcharts from "highcharts";
import { onMounted, onUnmounted, provide, ref, watch } from "vue";

import { debounce } from "@/lib/debounce";
import { key } from "@/lib/word-cloud/pie-chart.context";
import { type PieChartContext, type Token } from "@/lib/word-cloud/pie-chart.types";

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

onMounted(() => {
	if (elementRef.value == null) return;

	context.chart = Highcharts.chart(elementRef.value, {
		chart: { width: props.width, height: props.height, backgroundColor: "transparent" },
		colors: [...schemeCategory10],
		legend: { enabled: false },
		series: [{ name: "Occurrences", data: props.chart, type: "pie" }],
		title: { text: props.title },
		tooltip: { enabled: false },
	});

	emit("ready", context.chart);
});

const resize = debounce((_width: number, _height: number) => {
	if (context.chart == null) return;

	context.chart.reflow();
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

onUnmounted(() => {
	context.chart?.destroy();
});

provide(key, context);
</script>

<template>
	<div ref="elementRef" class="absolute inset-0 grid" data-word-cloud />
	<slot :context="context" />
</template>

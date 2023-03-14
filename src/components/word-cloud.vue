<script lang="ts" setup>
import { schemeCategory10 } from "d3";
import { type Chart, type SeriesOptionsType } from "highcharts";
import * as Highcharts from "highcharts";
import ChartAccessibility from "highcharts/modules/accessibility";
import WordCloudChart from "highcharts/modules/wordcloud";
import { nextTick, onMounted, onUnmounted, provide, ref, watch } from "vue";

import { debounce } from "@/lib/debounce";
import { key } from "@/lib/word-cloud/word-cloud.context";
import { type Token, type WordCloudContext } from "@/lib/word-cloud/word-cloud.types";

ChartAccessibility(Highcharts);
WordCloudChart(Highcharts);

const props = defineProps<{
	cloud: Array<Token>;
	height: number;
	title?: string;
	width: number;
}>();

const emit = defineEmits<{
	(event: "ready", cloud: Chart): void;
}>();

const context: WordCloudContext = {
	cloud: null,
};

const elementRef = ref<HTMLElement | null>(null);

function createSeries(): Array<SeriesOptionsType> {
	return [{ name: "Occurrences", data: props.cloud, type: "wordcloud" }];
}

onMounted(() => {
	if (elementRef.value == null) return;

	context.cloud = Highcharts.chart(elementRef.value, {
		chart: { width: props.width, height: props.height, backgroundColor: "transparent" },
		colors: [...schemeCategory10],
		// TODO: check if license allows to hide this
		// credits: { enabled: false },
		legend: { enabled: false },
		series: createSeries(),
		title: { text: props.title },
		tooltip: { pointFormat: "Occurences: {point.weight}" },
	});

	emit("ready", context.cloud);
});

const resize = debounce((width: number, height: number) => {
	if (context.cloud == null) return;

	nextTick(() => {
		context.cloud?.setSize(width, height);
		// context.cloud?.reflow();
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
		return props.cloud;
	},
	() => {
		context.cloud?.update({ series: createSeries() });
	},
);

onUnmounted(() => {
	context.cloud?.destroy();
});

provide(key, context);
</script>

<template>
	<div ref="elementRef" class="absolute inset-0 grid" data-word-cloud />
	<slot :context="context" />
</template>

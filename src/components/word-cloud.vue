<script lang="ts" setup>
import { schemeCategory10 } from "d3";
import { type Chart } from "highcharts";
import * as Highcharts from "highcharts";
import WordCloudChart from "highcharts/modules/wordcloud";
import { nextTick, onMounted, onUnmounted, provide, ref, watch } from "vue";

import { debounce } from "@/lib/debounce";
import { key } from "@/lib/word-cloud/word-cloud.context";
import { type Token, type WordCloudContext } from "@/lib/word-cloud/word-cloud.types";

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

onMounted(() => {
	if (elementRef.value == null) return;

	context.cloud = Highcharts.chart(elementRef.value, {
		chart: { width: props.width, height: props.height, backgroundColor: "transparent" },
		colors: [...schemeCategory10],
		// TODO: check if license allows to hide this
		// credits: { enabled: false },
		legend: { enabled: false },
		series: [{ name: "Occurrences", data: props.cloud, type: "wordcloud" }],
		title: { text: props.title },
		tooltip: { enabled: false },
	});

	emit("ready", context.cloud);
});

const resize = debounce((_width: number, _height: number) => {
	if (context.cloud == null) return;

	nextTick(() => {
		context.cloud?.reflow();
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

onUnmounted(() => {
	context.cloud?.destroy();
});

provide(key, context);
</script>

<template>
	<div ref="elementRef" class="absolute inset-0 grid" data-word-cloud />
	<slot :context="context" />
</template>
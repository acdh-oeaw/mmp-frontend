<script lang="ts" setup>
import { schemeCategory10 } from "d3";
import { type Chart } from "highcharts";
import * as Highcharts from "highcharts";
import WordCloudChart from "highcharts/modules/wordcloud";
import { onMounted, onUnmounted, provide, ref } from "vue";

import { key } from "@/lib/word-cloud/word-cloud.context";
import { type Token, type WordCloudContext } from "@/lib/word-cloud/word-cloud.types";

WordCloudChart(Highcharts);

const props = defineProps<{
	cloud: Array<Token>;
	title: string;
	height: number;
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
		legend: { enabled: false },
		series: [{ name: "Occurrences", data: props.cloud, type: "wordcloud" }],
		title: { text: props.title },
		tooltip: { enabled: false },
	});

	emit("ready", context.cloud);
});

onUnmounted(() => {
	context.cloud?.destroy();
});

provide(key, context);
</script>

<template>
	<div ref="elementRef" class="absolute inset-0 grid" data-word-cloud />
	<slot :context="context" />
</template>

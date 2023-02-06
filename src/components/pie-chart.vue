<script lang="ts" setup>
import { Chart } from 'highcharts-vue';
import { computed, onMounted, ref } from 'vue';

import type { Token } from '@/lib/word-cloud/word-cloud.types';

const props = defineProps<{
	data: Array<Token>;
	title: string;
}>();

const renderKey = ref(0);

onMounted(() => {
	renderKey.value -= -1; // this makes this component work, i dont know why
});

const pieOptions = computed(() => {
	const reducedData = props.data.filter((x: any, i: number) => i < 25);

	for (let i = 0; i < reducedData.length; i += 1) {
		for (let j = 1; reducedData[i].length > 30; j += 1)
			reducedData[i] = reducedData[i].filter((entry: any) => entry[1] > j); // improves performance by a lot
	}

	return {
		chart: {
			backgroundColor: 'transparent',
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie',
			height: 500,
		},
		title: {
			text: props.title || false,
		},
		credits: {
			enabled: false,
		},
		tooltip: {
			pointFormat: 'Occurences: {point.y}',
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: {point.y}',
				},
			},
		},
		series: {
			name: 'words',
			colorByPoint: true,
			data: reducedData,
		},
	};
});
</script>

<template>
	<div class="pie-wrapper">
		<Chart :options="pieOptions" />
	</div>
</template>

<style scoped>
.pie-wrapper {
	margin: 20px;
}
</style>

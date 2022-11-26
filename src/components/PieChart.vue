<script lang="ts" setup>
import { Chart } from 'highcharts-vue';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  data: Array<any>;
  title?: string;
  height?: number;
}>();

// FIXME: unclear if/why this is necessary
const renderKey = ref(0);
onMounted(() => {
  renderKey.value -= 1;
});

const pieOptions = computed(() => {
  const reducedData = props.data.filter((x, i) => i < 25);
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
      height: props.height || '500px',
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
  <div class="pieWrapper">
    <chart :options="pieOptions" />
  </div>
</template>

<style>
div.pieWrapper {
  margin: 20px;
}
</style>

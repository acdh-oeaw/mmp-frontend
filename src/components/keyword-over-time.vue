<script lang="ts" setup>
import { Chart } from 'highcharts-vue';
import { computed } from 'vue';

const props = defineProps<{
  data: any;
}>();

const chartData = computed(() => {
  return {
    chart: {
      backgroundColor: 'transparent',
    },
    credits: {
      enabled: false,
    },
    title: {
      text: '',
    },
    tooltip: {
      // split: true,
      // the only way the right 'this' object is passed to the formatter function

      formatter: function lel(this: any) {
        const endings = ['st', 'nd', 'rd'];
        return `${this.point.x}${endings[this.point.x - 1] || 'th'} century<br />${
          this.point.y
        } occurences`;
      },
    },
    legend: {
      verticalAlign: 'top',
    },
    yAxis: {
      title: {
        text: '',
      },
    },
    xAxis: {
      labels: {
        formatter: ({ value }: any) => value * 100,
      },
    },
    series: props.data.map((x: any) => ({
      name: x.title,
      data: x.data,
    })),
  };
});
</script>

<template>
  <div>
    <Chart :options="chartData" />
  </div>
</template>

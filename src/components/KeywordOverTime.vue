<template>
  <div>
    <chart :options="chartData" />
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';

export default ({
  name: 'OverTime',
  data: () => ({
  }),
  components: {
    Chart,
  },
  props: [
    'data',
  ],
  computed: {
    chartData() {
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
          // eslint-disable-next-line object-shorthand
          formatter: function lel() {
            const endings = ['st', 'nd', 'rd'];
            return `${this.point.x}${endings[this.point.x - 1] || 'th'} century<br />${this.point.y} occurences`;
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
            formatter: ({ value }) => value * 100,
          },
        },
        series: this.data.map((x) => ({
          name: x.title,
          data: x.data,
        })),
      };
    },
  },
  mounted() {
    console.log('Over time mounted', this.data);
  },
});
</script>

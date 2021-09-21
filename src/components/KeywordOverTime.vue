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
      const series = {
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
          formatter: function () {
            let ending;

            switch (this.point.x) {
              case 1:
                ending = 'st';
                break;
              case 2:
                ending = 'nd';
                break;
              case 3:
                ending = 'rd';
                break;
              default:
                ending = 'th';
                break;
            }
            return `${this.point.x}${ending} century<br />${this.point.y} occurences`;
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

      return series;
    },
  },
  mounted() {
    console.log('Over time mounted', this.data);
  },
});
</script>

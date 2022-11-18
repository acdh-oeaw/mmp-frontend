<template>
  <div class="pieWrapper">
    <chart :options="pieOptions" />
  </div>
</template>
<script>
import { Chart } from 'highcharts-vue';

export default {
  name: 'PieChart',
  components: { Chart },
  props: ['data', 'title', 'height'],
  data: () => ({
    renderKey: 0,
  }),
  computed: {
    pieOptions() {
      console.log(this.data, this.renderKey);

      const reducedData = this.data.filter((x, i) => i < 25);
      for (let i = 0; i < reducedData.length; i += 1) {
        for (let j = 1; reducedData[i].length > 30; j += 1)
          reducedData[i] = reducedData[i].filter((entry) => entry[1] > j); // improves performance by a lot
      }

      return {
        chart: {
          backgroundColor: 'transparent',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          height: this.height || '500px',
        },
        title: {
          text: this.title || false,
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
    },
  },
  mounted() {
    console.log('pie mounted', this.data);
    this.renderKey -= -1; // this makes this component work, i dont know why
  },
};
</script>
<style>
div.pieWrapper {
  margin: 20px;
}
</style>

<template>
  <div class="pieWrapper">
    <chart :options="cloudOptions" />
  </div>
</template>
<script>
import { Chart } from 'highcharts-vue';
import highcharts from 'highcharts';
import wordcloud from 'highcharts/modules/wordcloud';

import Gradient from 'javascript-color-gradient';

wordcloud(highcharts);

export default {
  name: 'WordCloudBeta',
  data: () => ({
    renderKey: 0,
  }),
  props: ['data', 'title'],
  components: { Chart },
  computed: {
    cloudOptions() {
      console.log(this.renderKey);

      const colors = [
        '#a91a1a',
        '#3a8d86',
        '#0c76ce',
        '#c09000',
        '#3b823e',
      ];
      const colorGradient = new Gradient();
      colorGradient.setGradient(...colors);

      colorGradient.setMidpoint(50);

      return {
        chart: {
          backgroundColor: 'transparent',
          height: '500px',
          type: 'wordcloud',
        },
        tooltip: {
          pointFormat: 'Occurences: {point.occ}',
        },
        title: {
          text: this.title || false,
        },
        credits: {
          enabled: false,
        },
        series: {
          name: 'Occurrences',
          data: this.data.map((x) => ({
            name: x[0],
            weight: x[1] ** (3 / 4),
            occ: x[1],
            color: colorGradient.getColor(Math.floor((50 * x[1]) / this.maxOccurence)),
          })),
        },
      };
    },
    maxOccurence() {
      return Math.max(...this.data.map((x) => x[1]));
    },
  },
  mounted() {
    console.log('cloudbeta mounted', this.data);
    this.renderKey -= -1; // this makes this component work, i dont know why
  },
};
</script>
<style>
text.highcharts-point {
  font-family: 'Roboto', sans-serif !important;
  scale: 1.3;
}
</style>

<template>
  <div class="cloud-wrapper">
    <chart class="chart" :options="cloudOptions" style="height: 500px; width: 500px"/>
  </div>
</template>
<script>
import highcharts from 'highcharts';
import { Chart } from 'highcharts-vue';
import wordcloud from 'highcharts/modules/wordcloud';

// import Gradient from 'javascript-color-gradient';

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
      // const colors = [
      //   '#a91a1a',
      //   '#3a8d86',
      //   '#0c76ce',
      //   '#c09000',
      //   '#3b823e',
      // ];
      // const colorGradient = new Gradient()
      //   .setColorGradient(...colors)
      //   .setMidpoint(this.maxOccurence || 50)
      //   .getColors();

      return {
        chart: {
          backgroundColor: 'transparent',
          height: '460px',
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
          data: this.data.map(([name, occ]) => ({
            name,
            occ,
            weight: Math.log(occ) ** 2,
            // color: colorGradient[occ],
          })),
          rotation: {
            from: 0,
            to: 0,
          },
          spiral: 'rectangular',
          placementStrategy: 'center',
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
.cloud-wrapper {
  height: 460px;
}
</style>

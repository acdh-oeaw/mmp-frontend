<template>
  <div class="pieWrapper">
    <chart :options="cloudOptions" />
  </div>
</template>
<script>
import { Chart } from 'highcharts-vue';
import highcharts from 'highcharts';
import wordcloud from 'highcharts/modules/wordcloud';

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
      return {
        chart: {
          backgroundColor: 'transparent',
          height: '500px',
          type: 'wordcloud',
        },
        tooltip: {
          pointFormat: 'Occurences: {point.occ}',
        },
        title: this.title || false,
        credits: {
          enabled: false,
        },
        series: {
          name: 'Occurrences',
          data: this.data.map((x) => ({
            name: x[0].toUpperCase(),
            weight: x[1] ** (3 / 4),
            occ: x[1],
          })),
        },
      };
    },
  },
  mounted() {
    console.log('cloudbeta mounted', this.data);
    this.renderKey -= -1; // this makes this component work, i dont know why
  },
};
</script>
<style scoped>
div.pieWrapper {
  margin: 20px;
}
</style>

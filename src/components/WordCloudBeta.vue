<template>
  <div class="cloud-wrapper" ref="cloudRel">
    <h3 class="text-center">{{ title }}</h3>
    <cloud
      :key="renderKey"
      :data="words"
      :fontSizeMapper="sizeFunction"
      :width="width"
      :height="height"
      padding="2"
    />
  </div>
</template>
<script>
import cloud from 'vue-d3-cloud';

export default {
  name: 'WordCloudBeta',
  data: () => ({
    renderKey: 0,
    width: 500,
    height: 500,
  }),
  props: ['data', 'title'],
  components: { cloud },
  computed: {
    words() {
      console.log(this.renderKey);
      return this.data.map(([text, value]) => ({ text, value }));
    },
    maxOccurences() {
      return Math.max(...this.words.map((word) => word.value));
    },
  },
  methods: {
    sizeFunction(word) {
      return Math.log2(word.value) * 10;
    },
  },
  mounted() {
    console.log('cloudbeta mounted', this.data);
    this.renderKey -= -1; // this makes this component work, i dont know why

    // resize canvas on div resize
    const sizeOberserver = new ResizeObserver((entries) => {
      console.log('oberserver', entries);
      this.width = entries[0].contentRect.width;
      this.height = entries[0].contentRect.height;
      this.renderKey += 1;
    });

    sizeOberserver.observe(this.$refs.cloudRel);
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

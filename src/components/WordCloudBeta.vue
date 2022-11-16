<template>
  <div ref="cloudRel" class="cloud-wrapper">
    <h3 class="text-center">{{ title }}</h3>
    <cloud
      :key="renderKey"
      :data="words"
      :font-size-mapper="sizeFunction"
      :width="width"
      :height="height"
      padding="2"
      :on-word-click="() => null"
      font="Roboto, sans-serif"
    />
  </div>
</template>
<script>
import cloud from 'vue-d3-cloud';

export default {
  name: 'WordCloudBeta',
  components: { cloud },
  props: ['data', 'title'],
  data: () => ({
    renderKey: 0,
    width: 500,
    height: 500,
  }),
  computed: {
    words() {
      console.log(this.renderKey);
      return this.data.map(([text, value]) => ({ text, value }));
    },
    maxOccurences() {
      return Math.max(...this.words.map((word) => word.value));
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
  methods: {
    sizeFunction(word) {
      return (word.value * 400) / this.words.length;
    },
  },
};
</script>
<style>
.cloud-wrapper {
  height: 460px;
}
</style>

<template>
  <v-btn
    absolute
    bottom
    :left="left !== undefined"
    :right="left === undefined"
    depressed
    icon
    @click="press"
  >
    <v-icon v-if="isFullScreen">mdi-fullscreen-exit</v-icon>
    <v-icon v-else>mdi-fullscreen</v-icon>
  </v-btn>
</template>

<script>
import helpers from '@/helpers';

export default {
  name: 'FullscreenButton',
  mixins: [helpers],
  props: ['usecase', 'left'],
  methods: {
    press() {
      this.$router.push({
        name: this.isFullScreen
          ? this.$route.name.replace(' Fullscreen', '')
          : `${
              this.usecase ? this.getComponentFromTab(this.$route.query.tab) : this.$route.name
            } Fullscreen`,
        query: this.usecase
          ? this.addParamsToQuery({ 'Use Case': this.usecase })
          : this.$route.query,
        params: this.$route.params,
      });
    },
    getComponentFromTab(tab) {
      const components = {
        cloud: 'Word Cloud',
        graph: 'Network Graph',
        map: 'Map',
      };
      return components[tab];
    },
  },
};
</script>

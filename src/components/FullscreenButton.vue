<template>
  <v-btn
    absolute
    bottom
    right
    depressed
    icon
    @click="press"
  >
    <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
    <v-icon v-else>mdi-fullscreen</v-icon>
  </v-btn>
</template>

<script>
import helpers from '@/helpers';

export default {
  name: 'FullscreenButton',
  props: ['usecase'],
  data() {
    return {
      back: null,
    };
  },
  mixins: [helpers],
  methods: {
    press() {
      console.log('FSButton press', this.back, this.$route);
      this.$router.push(
        this.back || {
          name: this.fullscreen ? this.back || this.$route.name.replace(' Fullscreen', '') : `${this.usecase ? this.getComponentFromTab(this.$route.query.tab) : this.$route.name} Fullscreen`,
          query: this.usecase ? this.addParamsToQuery({ 'Use Case': this.usecase }) : this.$route.query,
          params: this.$route.params,
        },
      );
      // this.back = this.$route.fullPath; // maybe someday
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

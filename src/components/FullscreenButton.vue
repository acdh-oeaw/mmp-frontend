<template>
  <v-btn
    absolute
    bottom
    right
    depressed
    icon
    :to="{
      name: fullscreen ? $route.name.replace(' Fullscreen', '') : `${$route.name} Fullscreen`,
      query: usecase ? { 'Use Case': usecase } : $route.query,
      params: $route.params
    }"
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
  mixins: [helpers],
};
</script>

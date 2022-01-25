<template>
  <v-app class="app-class">
    <template v-if="!$route.name.includes('Fullscreen')">
      <app-bar />
      <div class="buffer" :class="{ light: $route.name !== 'Home', smaller: $vuetify.breakpoint.mobile }" />
    </template>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar';

export default {
  name: 'App',
  data: () => ({

  }),
  components: {
    AppBar,
  },
};
</script>
<style lang="css">
  a {
    text-decoration: none !important;
  }
  .v-card__title {
    word-break: keep-all !important;
  }
  .app-class {
    background-color: #f1f5fa !important;
  }
  .buffer {
    background-color: #0F1226;
    height: 140px;
  }
  .buffer.smaller {
    height: 130px;
  }
  .buffer.light {
    background: unset;
  }
</style>

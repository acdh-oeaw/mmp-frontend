<template>
  <v-app class="app-class">
    <app-bar />
    <div class="buffer" :class="{ light: $route.name !== 'Home'}" />
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
<style lang="css" scoped>
  .app-class {
    background-color: #f1f5fa !important;
  }
  .buffer {
    background-color: #0F1226;
    height: 140px;
  }
  .buffer.light {
    background: unset;
  }
</style>

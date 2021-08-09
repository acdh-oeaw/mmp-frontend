<template>
  <v-app class="app-class">
    <app-bar />
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
  .app-class {
    background-color: #f1f5fa !important;
  }
</style>

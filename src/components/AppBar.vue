<template>
    <div>
      <v-app-bar
        flat
        elevate-on-scroll
        shrink-on-scroll
        fixed
        dark
        prominent
        color="#0f1226"
        class="app-bar"
        min-height="84px"
      >
        <v-row justify="center">
          <v-col cols="12" md="2" class="title-wrapper">
            <v-app-bar-nav-icon @click.stop="$store.commit('toggleDrawer')" class="d-inline d-md-none" />
            <v-toolbar-title class="d-inline fancy-font thick">
              MMP
            </v-toolbar-title>
          </v-col>
          <v-col cols="8" class="text-right d-none d-md-inline">
            <div>
              <router-link color="white" :to="{ name: '', params: {} }">
                About the Project
              </router-link>
              <span class="non-selectable">
                &nbsp;&nbsp;&bull;&nbsp;&nbsp;
              </span>
              <router-link :to="{ name: '', params: {} }">
                Case Studies
              </router-link>
              <span class="non-selectable">
                &nbsp;&nbsp;&bull;&nbsp;&nbsp;
              </span>
              <router-link :to="{ name: '', params: {} }">
                Explore the Data
              </router-link>
            </div>
          </v-col>
        </v-row>
      </v-app-bar>
      <sidebar v-model="drawer" />
    </div>
</template>

<script>
import Sidebar from './Sidebar';

export default {
  name: 'AppBar',
  components: {
    Sidebar,
  },
  data: () => ({
    drawer: false,
  }),
};
</script>

<style>
  a {
    color: white !important;
    text-decoration: none;
  }
  .app-bar {
    padding-top: 30px;
  }
  .fancy-font {
    font-family: "Times New Roman", Times, serif;
    font-size: 2em !important;
  }
  .non-selectable {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .thick {
    font-weight: bold;
  }
  .title-wrapper {
    padding: 0px !important;
  }
</style>

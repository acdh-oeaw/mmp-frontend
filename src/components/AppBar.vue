<template>
    <div>
      <v-app-bar
        fixed
        flat
        :dark="isHome"
        shrink-on-scroll
        :color="backgroundColor"
        class="app-bar"
        min-height="84px"
      >
        <v-row justify="center">
          <v-col cols="12" md="2" class="title-wrapper">
            <v-app-bar-nav-icon @click.stop="$store.commit('toggleDrawer')" class="d-inline d-md-none" />
            <v-toolbar-title class="d-inline fancy-font thick">
              <router-link
                :to="{ name: 'Home' }"
                class="nav-link"
                :class="{ light: !isHome }"
              >
                MMP
              </router-link>
            </v-toolbar-title>
          </v-col>
          <v-col cols="8" class="text-right d-none d-md-inline">
            <div :class="{ light: !isHome }">
              <router-link color="white" :to="{ name: '', params: {} }" class="nav-link">
                About the Project
              </router-link>
              <span class="non-selectable">
                &nbsp;&nbsp;&bull;&nbsp;&nbsp;
              </span>
              <router-link :to="{ name: '', params: {} }" class="nav-link">
                Case Studies
              </router-link>
              <span class="non-selectable">
                &nbsp;&nbsp;&bull;&nbsp;&nbsp;
              </span>
              <router-link :to="{ name: $store.state.interface.currentView }" class="nav-link">
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
  computed: {
    // set the background color to dark blue if on the landing page
    backgroundColor() {
      return this.isHome ? '#0f1226' : '#f1f5fa';
    },
    // check ig route is on lanfing page
    isHome() {
      return this.$route.name === 'Home';
    },
  },
};
</script>

<style>
  a.nav-link {
    color: white !important;
    text-decoration: none;
  }
  div.light a, .light.nav-link {
    color: rgba(0, 0, 0, 0.87) !important;
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

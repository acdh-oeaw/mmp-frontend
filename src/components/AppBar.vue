<template>
  <div>
    <v-app-bar
      fixed
      flat
      shrink-on-scroll
      :color="backgroundColor"
      class="app-bar"
      min-height="84px"
    >
      <v-row justify="center">
        <v-col cols="12" md="2" class="title-wrapper">
          <v-app-bar-nav-icon
            class="d-inline d-md-none menu-button"
            :class="{ 'white--text': isHome }"
            @click.stop="$store.commit('toggleDrawer')"
          />
          <v-toolbar-title class="d-inline fancy-font font-weight-bold text-decoration-none">
            <router-link
              :to="{ name: 'Home', query: addParamsToQuery() }"
              class="nav-link"
              :class="{ light: !isHome }"
            >
              MMP
            </router-link>
          </v-toolbar-title>
        </v-col>
        <v-col :cols="$route.name.includes('Detail') ? 4 : 8" class="text-right d-none d-md-inline">
          <div :class="{ light: !isHome }">
            <router-link
              color="white"
              :to="{ name: '', params: {}, query: addParamsToQuery() }"
              class="nav-link"
            >
              About the Project
            </router-link>
            <span class="non-selectable" :class="{ 'white--text': isHome }">
              &nbsp;&nbsp;&bull;&nbsp;&nbsp;
            </span>
            <router-link :to="{ name: 'Studies', query: addParamsToQuery() }" class="nav-link">
              Case&nbsp;Studies
            </router-link>
            <span class="non-selectable" :class="{ 'white--text': isHome }">
              &nbsp;&nbsp;&bull;&nbsp;&nbsp;
            </span>
            <router-link
              :to="{ name: $store.state.interface.currentView, query: addParamsToQuery() }"
              class="nav-link"
            >
              Explore&nbsp;the&nbsp;Data
            </router-link>
          </div>
        </v-col>
        <v-col v-if="$route.name.includes('Detail')" cols="4" />
      </v-row>
    </v-app-bar>
    <sidebar v-model="drawer" />
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar';
import helpers from '@/helpers';

export default {
  name: 'AppBar',
  components: {
    Sidebar,
  },
  mixins: [helpers],
  data: () => ({
    drawer: false,
  }),
  computed: {
    // set the background color to dark blue if on the landing page
    backgroundColor() {
      return this.isHome ? '#0f1226' : '#f1f5fa';
    },
    // check if route is on landing page
    isHome() {
      return this.$route.name === 'Home';
    },
  },
};
</script>

<style>
a.nav-link {
  color: white !important;
}

div.light a,
.light.nav-link {
  color: rgb(0 0 0 / 87%) !important;
}

.app-bar {
  padding-top: 30px;
}

.fancy-font {
  font-family: 'Times New Roman', Times, serif;
  font-size: 2em !important;
}

.non-selectable {
  user-select: none;
}

.title-wrapper {
  padding: 0 !important;
}

.menu-button {
  height: 100% !important;
  vertical-align: bottom !important;
}
</style>

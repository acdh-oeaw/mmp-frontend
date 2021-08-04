<template>
  <v-app>
    <v-app-bar
      flat
      elevate-on-scroll
      fixed
      dark
      color="rgba(0, 0, 0, 0)"
      max-height="64px"
    >
      <v-app-bar-nav-icon />
      <v-toolbar-title class="fancy-font thick">
        MMP
      </v-toolbar-title>
      <v-spacer />
      <router-link color="white" :to="{ name: '', params: {} }">
        About the Project
      </router-link>
      &nbsp;&nbsp;•&nbsp;&nbsp;
      <router-link :to="{ name: '', params: {} }">
        Case Studies
      </router-link>
      &nbsp;&nbsp;•&nbsp;&nbsp;
      <router-link :to="{ name: '', params: {} }">
        Explore the Data
      </router-link>•
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
<style lang="css">
  .fancy-font {
    font-family: "Times New Roman", Times, serif;
  }
  .thick {
    font-weight: bold;
  }
  a {
    color: white !important;
    text-decoration: none;
  }
</style>

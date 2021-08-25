<template>
  <v-navigation-drawer
    v-model="$store.state.interface.sidebarDrawer"
    color="#f1f5fa"
    fixed
    temporary
  >
    <v-list-item>
      <v-list-item-icon>
        <v-icon @click="$store.commit('toggleDrawer')">mdi-close</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="text-h6 sidebar-title font-weight-bold">
          <router-link :to="{ name: 'Home' }" class="sidebar-link">
            MMP
          </router-link>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list
      dense
      nav
    >
      <v-list-item
        link
      >
        <v-list-item-content>
          <v-list-item-title>About the Project</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
      >
        <v-list-item-content>
          <v-list-item-title>Case Studies</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        :to="{ name: $store.state.interface.currentView }"
        class="sidebar-link"
        link
      >
        <v-list-item-content>
          <v-list-item-title>Explore the Data</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'Sidebar',
};
</script>

<style scoped>
  .sidebar-link {
    color: rgba(0, 0, 0, 0.87) !important;
  }
</style>

<template>
  <v-navigation-drawer
    v-model="$store.state.interface.sidebarDrawer"
    color="#f1f5fa"
    fixed
    temporary
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h4 font-weight-bold">
          <v-icon @click.prevent="$store.commit('toggleDrawer')">mdi-close</v-icon>
          <router-link :to="{ name: 'Home' }">
            MMP
          </router-link>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider />

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
        :to="{ name: 'Studies' }"
        link
      >
        <v-list-item-content>
          <v-list-item-title>Case Studies</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        :to="{ name: $store.state.interface.currentView }"
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

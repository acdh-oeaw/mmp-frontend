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
          <v-list-item-title class="text-h6 sidebar-title">
            MMP
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
  div.sidebar-title {
    font-family: "Times New Roman", Times, serif !important;
    font-weight: bold;
  }
</style>

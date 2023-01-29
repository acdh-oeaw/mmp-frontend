<script lang="ts" setup>
import { useStore } from '@/lib/use-store';

const props = defineProps<{
  links: Record<string, { name: string; label: string }>;
}>();

const store = useStore();

function onToggleDrawer() {
  store.commit('toggleDrawer');
}
</script>

<template>
  <v-navigation-drawer
    v-model="store.state.interface.sidebarDrawer"
    color="background"
    fixed
    temporary
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h4 font-weight-bold">
          <v-icon @click.prevent="onToggleDrawer">mdi-close</v-icon>
          <router-link :to="{ name: 'Home' }">MMP</router-link>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <v-list dense nav>
      <v-list-item v-for="({ name, label }, key) of props.links" :key="key" :to="{ name }" link>
        <v-list-item-content>
          <v-list-item-title>{{ label }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

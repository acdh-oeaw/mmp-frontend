<script lang="ts" setup>
const props = defineProps<{
  isOpen: boolean;
  links: Record<string, { name: string; label: string }>;
}>();

const emit = defineEmits<{
  (event: 'toggle-panel'): void;
}>();

function onToggleDrawer() {
  emit('toggle-panel');
}
</script>

<template>
  <v-navigation-drawer
    :value="props.isOpen"
    color="background"
    fixed
    temporary
    @input="onToggleDrawer"
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

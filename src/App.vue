<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue';
import { useFullScreen } from '@/lib/use-full-screen';

const isFullScreen = useFullScreen();
</script>

<template>
  <v-app class="app-class">
    <template v-if="!isFullScreen">
      <app-bar />
      <div
        class="buffer"
        :class="{ light: $route.name !== 'Home', smaller: $vuetify.breakpoint.mobile }"
      />
    </template>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
a {
  text-decoration: none !important;
}

.v-card__title {
  word-break: keep-all !important;
}

.app-class {
  background-color: #f1f5fa !important;
}

.buffer {
  background-color: #0f1226;
  height: 140px;
}

.buffer.smaller {
  height: 130px;
}

.buffer.light {
  background: unset;
}
</style>

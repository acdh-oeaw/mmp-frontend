<script lang="ts" setup>
import { useFullScreen } from '@/lib/use-full-screen';
import { useHomePage } from '@/lib/use-home-page';

const isHomePage = useHomePage();
const isFullScreen = useFullScreen();
</script>

<template>
  <VApp class="app">
    <template v-if="!isFullScreen">
      <AppBar />
      <div class="buffer" :class="{ light: !isHomePage, smaller: $vuetify.breakpoint.mobile }" />
    </template>
    <VMain>
      <RouterView />
    </VMain>
  </VApp>
</template>

<style>
a {
  text-decoration: none !important;
}

.v-card__title {
  word-break: keep-all !important;
}

.app {
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

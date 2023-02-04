<script lang="ts" setup>
import { useHomePage } from '@/lib/use-home-page';

const isHomePage = useHomePage();
</script>

<template>
  <VApp class="app">
    <AppBar />
    <div class="buffer" :class="{ light: !isHomePage, smaller: $vuetify.breakpoint.mobile }" />
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

<script lang="ts" setup>
import { computed } from 'vue';

import Sidebar from '@/components/Sidebar.vue';
import { useDetailsPage } from '@/lib/use-details-page';
import { useHomePage } from '@/lib/use-home-page';

const isHomePage = useHomePage();
const isDetailsPage = useDetailsPage();
const backgroundColor = computed(() => (isHomePage ? '#0f1226' : '#f1f5fa'));
</script>

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
            :class="{ 'white--text': isHomePage }"
            @click.stop="$store.commit('toggleDrawer')"
          />
          <v-toolbar-title class="d-inline fancy-font font-weight-bold text-decoration-none">
            <router-link :to="{ name: 'Home' }" class="nav-link" :class="{ light: !isHomePage }">
              MMP
            </router-link>
          </v-toolbar-title>
        </v-col>
        <v-col :cols="isDetailsPage ? 4 : 8" class="text-right d-none d-md-inline">
          <div :class="{ light: !isHomePage }">
            <router-link color="white" :to="{ name: '' }" class="nav-link">
              About the Project
            </router-link>
            <span class="non-selectable" :class="{ 'white--text': isHomePage }">
              &nbsp;&nbsp;&bull;&nbsp;&nbsp;
            </span>
            <router-link :to="{ name: 'Case Studies' }" class="nav-link">
              Case&nbsp;Studies
            </router-link>
            <span class="non-selectable" :class="{ 'white--text': isHomePage }">
              &nbsp;&nbsp;&bull;&nbsp;&nbsp;
            </span>
            <router-link :to="{ name: 'Interface' }" class="nav-link">
              Explore&nbsp;the&nbsp;Data
            </router-link>
          </div>
        </v-col>
        <v-col v-if="isDetailsPage" cols="4" />
      </v-row>
    </v-app-bar>
    <sidebar />
  </div>
</template>

<style scoped>
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

<template>
  <v-navigation-drawer
    permanent
    fixed
    right
    color="#F1F5FA"
    :width="drawerWidth"
  >
    <v-list-item class="keyword-header">
        <v-list-item-action>
          <router-link :to="{ name: fullscreen ? 'Map Fullscreen' : 'Map', query: $route.query }" class="text-decoration-none">
            <v-icon>mdi-close</v-icon>
          </router-link>
        </v-list-item-action>
        <v-list-item-content>
          <template v-if="!loading">
            <v-list-item-title class="text-h5">

            </v-list-item-title>
          </template>
          <v-skeleton-loader
            v-else
            type="heading, text@2"
          />
        </v-list-item-content>
      </v-list-item>
      <v-divider />
  </v-navigation-drawer>
</template>

<script>
import helpers from '@/helpers';

export default {
  name: 'SpatialDetails',
  mixins: [helpers],
  watch: {
    '$route.params': {
      handler(params) {
        console.log('place params', params);
        this.loading = true;
        const address = `https://mmp.acdh-dev.oeaw.ac.at/api/spatialcoverage/?format=json&id=${params.id}`;
        console.log('fetching', address);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

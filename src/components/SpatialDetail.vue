<template>
  <v-navigation-drawer
    permanent
    fixed
    right
    color="#F1F5FA"
    :width="drawerWidth"
  >
    <v-list-item>
        <v-list-item-action>
          <router-link :to="{ name: fullscreen ? 'Map Fullscreen' : 'Map', query: $route.query }" class="text-decoration-none">
            <v-icon>mdi-close</v-icon>
          </router-link>
        </v-list-item-action>
        <v-list-item-content>
          <template v-if="!loading">
            <v-list-item-title class="text-h5">
              Keyword: {{ data.properties.key_word.stichwort }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ data.properties.key_word.art }}
            </v-list-item-subtitle>
          </template>
          <v-skeleton-loader
            v-else
            type="heading, text@2"
          />
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list v-if="!loading">
        <v-subheader>Passages</v-subheader>
        <v-list-item v-for="passage in data.properties.stelle" :key="passage.url" v-ripple>
          <v-hover v-slot="{ hover }">
            <router-link :to="{
              name: fullscreen ? 'Passage Detail Fullscreen' : 'Passage Detail',
              query: { Passage: getIdFromUrl(passage.url) },
              params: { id: getIdFromUrl(passage.url) }}"            >
              <v-list-item-content :class="{ 'selected': hover }">
                <v-list-item-title>
                    {{ passage.display_label }}
                </v-list-item-title>
                <v-list-item-subtitle v-if="passage.text.autor.length">
                  {{ passage.text.title }}, {{ passage.text.autor.map((x) => getOptimalName(x)).join(', ') }}
                  <v-icon v-if="!passage.text.jahrhundert">mdi-chevron-right</v-icon>
                </v-list-item-subtitle>
                <v-list-item-subtitle v-if="passage.text.jahrhundert">
                  {{ passage.text.jahrhundert }} century
                  <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-subtitle>
              </v-list-item-content>
            </router-link>
          </v-hover>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-skeleton-loader type="sentences@7" />
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
  </v-navigation-drawer>
</template>

<script>
import helpers from '@/helpers';

export default {
  name: 'SpatialDetails',
  data: () => ({
    loading: false,
    data: {},
  }),
  mixins: [helpers],
  watch: {
    '$route.params': {
      handler(params) {
        console.log('place params', params);
        this.loading = true;
        const address = `https://mmp.acdh-dev.oeaw.ac.at/api/spatialcoverage/${params.id}`;
        const prefetched = this.$store.state.fetchedResults[address];
        if (prefetched) {
          this.data = prefetched;
          this.loading = false;
        } else {
          fetch(address)
            .then((res) => res.json())
            .then((jsonRes) => {
              this.data = jsonRes;
              this.$store.commit('addToResults', { req: address, res: jsonRes });
              console.log('spatial res', jsonRes);
            })
            .catch((err) => {
              console.error(err);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<template>
  <v-navigation-drawer permanent fixed right color="#F1F5FA" :width="drawerWidth">
    <v-list-item>
      <v-list-item-action>
        <router-link :to="{ name: fullscreen ? 'Map Fullscreen' : 'Map', query: $route.query }"
          class="text-decoration-none">
          <v-icon>mdi-close</v-icon>
        </router-link>
      </v-list-item-action>
      <v-list-item-title>
        Keyword(s) found at point
      </v-list-item-title>
    </v-list-item>
    <v-divider />
    <v-list v-model="data" v-if="!loading">
      <v-list v-for="d in data" :key="d.id">
        <v-list-item>
          <v-list-item-content>
            <template v-if="!loading">
              <v-list-item-title class="text-h5">
                Keyword: {{ d.properties.key_word.stichwort }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ d.properties.key_word.art }}
              </v-list-item-subtitle>
            </template>
            <v-skeleton-loader v-else type="heading, text@2" />
          </v-list-item-content>
        </v-list-item>
        <v-subheader hide-details>Texts</v-subheader>
        <v-list-item v-for="text in removeDuplicates(d.properties.texts, ['id'])" :key="text.id">
          <v-list>
            <v-list-item-content>
              <v-list-item-title>
                {{ text.title }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="text.authors.length">
                {{ text.authors.map((x) => x.name).join(', ') }}
              </v-list-item-subtitle>
              <v-list-item-subtitle v-if="text.places.length">
                <!-- {{ text.places.map((x) => x.name).join(', ') }} -->
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list>
        </v-list-item>
        <v-subheader>Passages</v-subheader>
        <v-list-item v-for="passage in d.properties.stelle" :key="passage.id" :to="{
              name: fullscreen ? 'Passage Detail Fullscreen' : 'Passage Detail',
              query: addParamsToQuery({ Passage: passage.id }),
              params: { id: passage.id }}">
          <v-list-item-content>
            <v-list-item-title>
              {{ passage.display_label }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="passage.start_date || passage.end_date">
              {{ displayTimeRange(passage.start_date, passage.end_date) }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-divider />
      </v-list>
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
    data: [],
  }),
  mixins: [helpers],
  watch: {
    '$route.params': {
      handler(params) {
        let arr = JSON.parse(params.id);
        if (typeof arr === 'number') {
          const arr2 = [arr];
          arr = arr2;
        }
        console.log('place params', params, typeof params, arr, typeof arr);
        this.data = [];
        arr.forEach((param) => {
          console.log(param, 'ahoy arr');
          this.loading = true;
          const address = `https://mmp.acdh-dev.oeaw.ac.at/api/spatialcoverage/${param}`;
          const prefetched = this.$store.state.fetchedResults[address];
          console.log(address, 'addressss');
          if (prefetched) {
            this.data.push(prefetched);
            this.loading = false;
          } else {
            fetch(address)
              .then((res) => res.json())
              .then((jsonRes) => {
                this.data.push(jsonRes);
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
        });
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

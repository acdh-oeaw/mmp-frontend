<template>
  <v-card
    color="transparent"
    width="100%"
    class="map-wrapper"
  >
    <v-overlay
      absolute
      class="overlay"
      opacity=".2"
      :value="!entries.count"
      z-index="1000"
    >
      <h1 class="no-nodes">
        No Locations found!
      </h1>
    </v-overlay>
    <l-map
      :zoom="3"
      style="height: 500px; width: 100%"
      :bounds="bounds"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <l-geo-json :geojson="entries" />
    </l-map>
    <!-- <div v-for="(feature, i) in featureList">
      <div
      class="card"
      :key="i+feature.properties.key_word.url"
      data-toggle="collapse"
      :data-target="`#${i+feature.properties.key_word.url}`"
      >
        <div class="card-header list">
          {{ feature.properties.key_word.stichwort }}
          <span class="badge badge-pill badge-primary">{{ feature.properties.stelle.length }}</span>
        </div>
      </div>
      <div class="card-body collapse" :id="i+feature.properties.key_word.url">
        <data-table :data="feature.properties.stelle" />
      </div>
    </div> -->
  </v-card>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import { latLngBounds, L } from 'leaflet';
import { LMap, LGeoJson, LTileLayer } from 'vue2-leaflet';

export default {
  name: 'Map',
  data: () => ({
    bounds: latLngBounds([
      [34.016242, 5.488281],
      [71.663663, 34.667969],
    ]),
    entries: null,
    loading: false,
  }),
  components: {
    LMap,
    LGeoJson,
    LTileLayer,
  },
  methods: {
    getBounds(arr) {
      if (!arr.length) {
        return latLngBounds([
          [34.016242, 5.488281],
          [71.663663, 34.667969],
        ]);
      }
      const coords = arr
        .map((x) => x.geometry.coordinates)
        .flat(2);

      const xCords = coords.map((x) => x[1]);
      const yCords = coords.map((y) => y[0]);

      return latLngBounds([
        [Math.min(...xCords), Math.min(...yCords)],
        [Math.max(...xCords), Math.max(...yCords)],
      ]);
    },
    foundLocations() {
      return this.entries.length && !this.entries.count && this.entries.features.length;
    },
  },
  watch: {
    '$route.query': {
      handler(query) {
        const terms = {
          Author: 'stelle__text__autor',
          Passage: 'stelle',
          Keyword: 'key_word',
          // 'Use Case': 'unused',
        };
        let adress = 'https://mmp.acdh-dev.oeaw.ac.at/api/spatialcoverage/?format=json';
        Object.keys(query).forEach((cat) => {
          if (query[cat]) {
            const arr = query[cat].split('+');
            arr.forEach((val) => {
              adress += `&${terms[cat]}=${val}`;
            });
          }
        });

        if (query.time) {
          if (query.time.toString().includes('+')) {
            const times = query.time.split('+');
            adress += `&stelle__start_date=${times[0]}&stelle__start_date_lookup=lt`;
            adress += `&stelle__end_date=${times[1]}&stelle__end_date_lookup=gt`;
          } else {
            adress += `&stelle__start_date=${query.time - 5}&stelle__start_date_lookup=lt`;
            adress += `&stelle__end_date=${query.time + 4}&stelle__end_date_lookup=gt`;
          }
        }
        console.log('adress', adress);

        const prefetched = this.$store.state.fetchedResults[adress];
        if (prefetched) {
          this.entries = prefetched;
          this.bounds = this.getBounds(prefetched.features);
        } else {
          this.loading = true;
          fetch(adress)
            .then((res) => res.json())
            .then((res) => {
              console.log('map-data', res, L);
              this.$store.commit('addToResults', { req: adress, res });
              this.entries = res;
              this.bounds = this.getBounds(res.features);
            })
            .catch((err) => {
              console.log(err);
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

<style scoped>
  .map-wrapper {
    z-index: 0;
  }
</style>

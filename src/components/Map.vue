<template>
  <v-card
    color="transparent"
    width="100%"
    class="map-wrapper"
  >
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
        this.loading = true;

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
        console.log('adress', adress);
        fetch(adress)
          .then((res) => res.json())
          .then((res) => {
            console.log('map-data', res, L);
            this.entries = res;
            this.bounds = this.getBounds(res.features);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.loading = false;
          });
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

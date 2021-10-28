<template>
  <div>
    <v-overlay
      absolute
      class="overlay"
      opacity=".2"
      :value="!data || !data.count || loading"
      z-index="1000"
    >
      <h1 v-if="!loading" class="no-nodes">
        No locations found!
      </h1>
      <h1 v-else>
        <v-progress-circular
          indeterminate
          color="#0F1226"
        />
      </h1>
    </v-overlay>
    <l-map
      :zoom="3"
      :style="`height: ${height}px; width: 100%`"
      :bounds="bounds"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <l-geo-json v-if="data" :geojson="data" />
    </l-map>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import { latLngBounds, L } from 'leaflet';
import { LMap, LGeoJson, LTileLayer } from 'vue2-leaflet';

export default {
  name: 'Leaflet',
  data: () => ({
    bounds: latLngBounds([
      [34.016242, 5.488281],
      [71.663663, 34.667969],
    ]),
  }),
  props: {
    data: {
      default: null,
    },
    loading: {
      default: false,
    },
    height: {
      default: 500,
    },
  },
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
      console.log('coords', arr.map((x) => x.geometry.coordinates), L);
      const coords = arr
        .filter((x) => x.geometry?.coordinates.length)
        .map((x) => x.geometry?.coordinates)
        .flat(2);

      const xCords = coords.map((x) => x[1]);
      const yCords = coords.map((y) => y[0]);

      return latLngBounds([
        [Math.min(...xCords), Math.min(...yCords)],
        [Math.max(...xCords), Math.max(...yCords)],
      ]);
    },
    // foundLocations() {
    //   return this.entries.length && !this.entries.count && this.entries.features.length;
    // },
  },
  watch: {
    data(to) {
      console.log('to', to);

      const filteredCoords = to;
      filteredCoords.features = filteredCoords.features.filter((x) => x.geometry);
      this.bounds = this.getBounds(filteredCoords.features || []);
    },
  },
};
</script>

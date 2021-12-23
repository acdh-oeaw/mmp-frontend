<template>
  <div>
    <v-overlay
      absolute
      class="overlay"
      opacity=".2"
      :value="loading || !data.some((d) => d.count)"
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
      :style="`height: ${$route.path.includes('/view/') ? '100vh' : height + 'px'}; width: 100%`"
      :bounds="bounds"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <l-control position="bottomright">
        <v-btn
          fab
          small
          :to="{
            name: $route.path.includes('/view/') ? 'Map' : 'Map Fullscreen',
            query: usecase ? {'Use Case': usecase} : $route.query
          }"
        >
          <v-icon v-if="$route.path.includes('/view/')">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>
      </l-control>
      <l-control position="topright">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          left
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-layers-triple</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>Select Layers</v-card-title>
            <v-card-text>
              <v-checkbox
                v-model="showLayers.spatial"
                label="Spatial Coverage"
                color="green"
                dense
              />
              <v-checkbox
                v-model="showLayers.cones"
                color="blue"
                dense
                label="Cones"
              />
              <v-checkbox
                disabled
                v-model="showLayers.places"
                label="Places"
                dense
              />
            </v-card-text>
            <v-card-actions>
              <v-btn
                @click="menu = false"
                text
                small
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </l-control>
      <l-geo-json
        v-if="data[0] && showLayers.spatial"
        :geojson="data[0]"
        :options="{onEachFeature: onEach}"
        :options-style="spatialStyle"
      />
      <l-geo-json
        v-if="data[1] && showLayers.cones"
        :geojson="data[1]"
        :options="{onEachFeature: onEach}"
      />
    </l-map>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import { latLngBounds, L } from 'leaflet';
import {
  LMap,
  LGeoJson,
  LTileLayer,
  LControl,
} from 'vue2-leaflet';

export default {
  name: 'Leaflet',
  data: () => ({
    bounds: latLngBounds([
      [34.016242, 5.488281],
      [71.663663, 34.667969],
    ]),
    menu: false,
    showLayers: {
      spatial: true,
      cones: false,
      places: false,
    },
  }),
  props: {
    data: {
      default: [],
    },
    loading: {
      default: false,
    },
    height: {
      default: 500,
    },
    usecase: {
      default: '',
    },
  },
  components: {
    LMap,
    LGeoJson,
    LTileLayer,
    LControl,
  },
  computed: {
    onEach() {
      return (feature, layer) => {
        // console.log('feature, layer', feature, layer);
        layer
          .bindTooltip(
            `<div>Keyword: ${feature.properties.key_word.stichwort}</div>
            <div>Passages: ${feature.properties.stelle.length}</div>
            <div>Certainty: ${11 - feature.properties.fuzzyness}</div>`,
            { permanent: false, sticky: true },
          )
          .on({
            click: (e) => {
              console.log('click', e);
            },
          });
      };
    },
    spatialStyle() {
      return (feature) => ({
        color: 'green',
        fillColor: 'green',
        fillOpacity: 1 / (feature.properties.fuzzyness + 1),
        weight: 1.5,
      });
    },
    coneStyle() {
      return (feature) => ({
        fillOpacity: 1 / (feature.properties.fuzzyness + 1),
        weight: 1.5,
      });
    },
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
      console.log('to', to, this.data);
      if (to[0]) {
        const filteredCoords = to[0];
        filteredCoords.features = filteredCoords.features.filter((x) => x.geometry);
        this.bounds = this.getBounds(filteredCoords.features || []);

        const places = {};

        places.passages = to[0].features.map((x) => x.properties.stelle.map((y) => y.ort));
        places.texts = to[1].features.map((x) => x.properties.stelle.map((y) => y.ort));
        console.log('places', places);
      }
    },
  },
};
</script>

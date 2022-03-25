<template>
  <div>
    <l-map
      :style="`height: ${fullscreen && $route.name !== 'Keyword Detail Fullscreen' ? '100vh' : height + 'px'}; width: 100%; z-index: 4`"
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
            name: fullscreen ? 'Map' : 'Map Fullscreen',
            query: usecase ? {'Use Case': usecase} : $route.query
          }"
        >
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
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
                color="red darken-1"
                dense
                :disabled="!(data[0] && data[0].count)"
              >
                <template v-slot:label>
                  Spatial&nbsp;Coverage
                  &nbsp;
                  <v-chip color="red darken-1" dark small :disabled="!data[0] || !data[0].count">
                    <template v-if="loading">
                      <v-progress-circular
                        indeterminate
                        :size="15"
                        :width="2"
                      />
                    </template>
                    <template v-else>
                      {{ data[0].count }}
                    </template>
                  </v-chip>
                </template>
              </v-checkbox>
              <v-checkbox
                v-model="showLayers.cones"
                color="yellow darken-1"
                dense
                :disabled="!(data[1] && data[1].count)"
              >
                <template v-slot:label>
                  Cones
                  &nbsp;
                  <v-chip color="yellow darken-1" small :disabled="!data[1] || !data[1].count">
                    <template v-if="loading">
                      <v-progress-circular
                        indeterminate
                        :size="15"
                        :width="2"
                      />
                    </template>
                    <template v-else>
                      {{ data[1].count }}
                    </template>
                  </v-chip>
                </template>
              </v-checkbox>
              <v-checkbox
                v-model="showLayers.places"
                color="green lighten-1"
                dense
                :disabled="!(data[2] && data[2].count)"
              >
                <template v-slot:label>
                  Places
                  &nbsp;
                  <v-chip color="green lighten-1" dark small :disabled="!data[2] || !data[2].count">
                    <template v-if="loading">
                      <v-progress-circular
                        indeterminate
                        :size="15"
                        :width="2"
                      />
                    </template>
                    <template v-else-if="data[2]">
                      {{ data[2].count }}
                    </template>
                    <template v-else>
                      0
                    </template>
                  </v-chip>
                </template>
              </v-checkbox>
              <v-checkbox
                v-model="showLayers.relatedPlaces"
                color="green lighten-1"
                dense
                :disabled="!relatedPlaces.length"
              >
                <template v-slot:label>
                  Related&nbsp;Places
                  &nbsp;
                  <v-chip
                    color="green lighten-1"
                    dark
                    small
                    :disabled="!relatedPlaces.length"
                  >
                    <v-progress-circular
                      v-if="loading"
                      indeterminate
                      :size="15"
                      :width="2"
                    />
                    <template v-else>
                      {{ relatedPlaces.length }}
                    </template>
                  </v-chip>
                </template>
              </v-checkbox>
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
        :options="{ onEachFeature: onEach }"
        :options-style="spatialStyle"
      />
      <l-geo-json
        v-if="data[1] && showLayers.cones"
        :geojson="data[1]"
        :options="{ onEachFeature: onEach }"
        :options-style="coneStyle"
      />
      <l-geo-json
        v-if="data[2] && data[2].results && showLayers.places"
        :geojson="data[2].results"
        :options="{ onEachFeature: onEachPlace }"
      />
      <template v-if="showLayers.relatedPlaces">
        <l-marker
          v-for="place in relatedPlaces"
          :key="place.url"
          :lat-lng="returnLatLng(place.coords.coordinates)"
          @click="$router.push({
            name: fullscreen ? 'Place Detail Fullscreen' : 'Place Detail',
            query: $route.query,
            params: { id: getIdFromUrl(place.url) },
          })"
        >
          <l-tooltip>
            <div>Name: {{ place.name }}</div>
            <div v-if="place.name_antik">Ancient Name: {{ place.name_antik }}</div>
          </l-tooltip>
        </l-marker>
      </template>
    </l-map>
    <v-overlay
      absolute
      class="overlay"
      opacity=".2"
      :value="loading || !data.some((d) => d.count)"
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
    <router-view />
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import {
  latLng,
  latLngBounds,
  L,
  Icon,
} from 'leaflet';
import {
  LMap,
  LGeoJson,
  LTileLayer,
  LControl,
  LMarker,
  LTooltip,
} from 'vue2-leaflet';

import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import helpers from '@/helpers';
import greenMarker from '@/assets/recolored_marker_icon.png';
import greenMarker2x from '@/assets/recolored_marker_icon_2x.png';

export default {
  name: 'Leaflet',
  data: () => ({
    bounds: latLngBounds([
      [34.016242, 5.488281],
      [71.663663, 34.667969],
    ]),
    menu: false,
    relatedPlaces: [],
    showLayers: {
      spatial: true,
      cones: true,
      places: true,
      relatedPlaces: true,
    },
  }),
  props: {
    data: {
      default: [[], [], []],
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
  mixins: [helpers],
  components: {
    LMap,
    LGeoJson,
    LTileLayer,
    LControl,
    LMarker,
    LTooltip,
  },
  computed: {
    coneStyle() {
      return (feature) => ({
        color: '#FDD835',
        fillOpacity: 1 / (feature.properties.fuzzyness + 1),
        weight: 1.5,
      });
    },
    onEach() {
      return (feature, layer) => {
        // console.log('feature, layer', feature, layer);
        layer
          .bindTooltip(
            `
            <div>Keyword: ${feature.properties.key_word.stichwort}</div>
            <div>Passages: ${feature.properties.stelle.length}</div>
            <div>Certainty: ${11 - feature.properties.fuzzyness} / 10</div>
            `,
            { permanent: false, sticky: true },
          )
          .on({
            click: (e) => {
              console.log('click', feature, e);
              this.$router.push({
                name: this.fullscreen ? 'Spatial Detail Fullscreen' : 'Spatial Detail',
                query: this.$route.query,
                params: { id: feature.id },
              });
            },
          });
      };
    },
    onEachPlace() {
      return (feature, layer) => {
        layer
          .bindTooltip(
            `
            <div>Name: ${feature.properties.name}</div>
            ${feature.properties.name_antik ? `<div>Ancient Name: ${feature.properties.name_antik}</div>` : ''}
            `,
            { permanent: false, sticky: true },
          )
          .on({
            click: () => {
              console.log('click', feature);
              // features.properties.id doesn't exist yet
              this.$router.push({
                name: this.fullscreen ? 'Place Detail Fullscreen' : 'Place Detail',
                query: this.$route.query,
                params: { id: feature.id },
              });
            },
          });
      };
    },
    spatialStyle() {
      return (feature) => ({
        color: '#E53935',
        fillOpacity: 1 / (feature.properties.fuzzyness + 1),
        weight: 1.5,
      });
    },
  },
  methods: {
    getBounds(coordArr) {
      console.log('getBounds', coordArr);
      if (!coordArr.length) {
        return latLngBounds([
          [34.016242, 5.488281],
          [71.663663, 34.667969],
        ]);
      }

      if (coordArr.length === 1) {
        return latLngBounds([
          [coordArr[0][1] - 2, coordArr[0][0] - 2],
          [coordArr[0][1] + 2, coordArr[0][0] + 2],
        ]);
      }

      console.log('coords', coordArr, L);

      const xCords = coordArr.map((x) => x[1]);
      const yCords = coordArr.map((y) => y[0]);

      return latLngBounds([
        [Math.min(...xCords), Math.min(...yCords)],
        [Math.max(...xCords), Math.max(...yCords)],
      ]);
    },
    returnLatLng(coords) {
      return latLng(coords[1], coords[0]);
    },
    // foundLocations() {
    //   return this.entries.length && !this.entries.count && this.entries.features.length;
    // },
  },
  watch: {
    data: {
      handler(to) {
        console.log('to', to, this.data);
        if (to.length) {
          let allCoords = to[0].features
            .concat(to[1].features)
            .map((x) => x.geometry?.coordinates)
            .flat(2);
          if (to[2] && !Array.isArray(to[2].results)) {
            allCoords = allCoords.concat(to[2].results?.features
              .map((x) => x.geometry?.coordinates));
          }

          allCoords = allCoords.filter((x) => x);

          console.log('allCoords', allCoords);

          const places = {
            texts: {
              spatial: [],
              cones: [],
            },
          };
          places.texts.spatial = to[0].features.map((x) => x.properties.texts.map((y) => y.places));
          places.texts.cones = to[1].features.map((x) => x.properties.texts.map((y) => y.places));

          const allPlaces = places.texts.spatial.concat(places.texts.cones)
            .flat(2)
            .filter((x) => x?.coords?.coordinates);

          console.log('allPlaces', allPlaces);
          this.relatedPlaces = this.removeDuplicates(allPlaces, ['url']);
          const relatedCoords = this.relatedPlaces.map((x) => x.coords.coordinates);
          this.bounds = this.getBounds(allCoords.concat(relatedCoords));
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // this is a fix for missing marker icons that was provided on the vue-leaflet documentation, i changed it up for custom icons
    // eslint-disable-next-line no-underscore-dangle
    delete Icon.Default.prototype._getIconUrl;
    Icon.Default.mergeOptions({
      iconRetinaUrl: greenMarker2x,
      iconUrl: greenMarker,
      shadowUrl: markerShadow,
    });
  },
};
</script>

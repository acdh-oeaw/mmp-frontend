<template>
  <div>
    <l-map
      ref="map" :style="`height: ${fullscreen && $route.name !== 'Keyword Detail Fullscreen' ? '100vh' : height + 'px'}; width: 100%; z-index: 4`"
      :bounds="bounds"
    >
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :attribution="tileProvider.attribution"
        layer-type="base"
        :options="tileOptions" />
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
                v-on:change="uncheckSpatial()"
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
                v-model="showLayers.labels"
                color="blue darken-1"
                dense
                :disabled="!(polygonCenters && polygonCenters.count)"
              >
                <template v-slot:label>
                  Labels
                  &nbsp;
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
            <v-card-title>Select Basemap</v-card-title>
            <v-card-text>
              <v-radio-group v-model="radioGroup">
                <v-radio v-for="tileProvider in tileProviders" :key="tileProvider.id" :label="tileProvider.name" :value="tileProvider.id" v-on:change="changeBasemap(tileProvider.id)">
                </v-radio>
              </v-radio-group>
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
        v-if="data[0] && showLayers.spatial && showLayers.labels"
        :geojson="polygonCenters"
        :options="optionsLabels"
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
        :options="optionsMarkers"
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
import * as L from 'leaflet';
import {
  latLng,
  latLngBounds,
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
import redMarker from '@/assets/red_marker_icon.png';
import blueMarker from '@/assets/blue_marker_icon.png';
import greenMarker2x from '@/assets/recolored_marker_icon_2x.png';

export default {
  name: 'Leaflet',
  data: () => ({
    polygonCenters: {},
    bounds: latLngBounds([
      [34.016242, 5.488281],
      [71.663663, 34.667969],
    ]),
    radioGroup: 1,
    url: process.env.BASE_URL,
    tileOptions: {
      maxZoom: 8,
      minZoom: 4,
    },
    tileProviders: [
      {
        name: 'OpenStreetMap',
        id: 1,
        visible: true,
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
      {
        name: 'Esri - World Imagery',
        id: 2,
        visible: false,
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      },
      {
        name: 'Digital Atlas of the Roman Empire',
        id: 3,
        visible: false,
        url: 'https://dh.gu.se/tiles/imperium/{z}/{x}/{y}.png',
        attribution:
          '© Johan Åhlfeldt, Centre for Digital Humanities, University of Gothenburg 2019. Contact: johan.ahlfeldt@lir.gu.se',
      },
      {
        name: 'Humanitarian OpenStreetMap',
        id: 4,
        visible: false,
        url: 'https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      },
      {
        name: 'OpenTopoMap',
        id: 5,
        visible: false,
        url: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      },
      {
        name: 'TestTiles',
        id: 6,
        visible: false,
        url: 'http://127.0.0.1:8887/{z}/{x}/{y}.png',
        tms: false,
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      },
    ],
    menu: false,
    relatedPlaces: [],
    showLayers: {
      spatial: true,
      labels: true,
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
        fillOpacity: 0.6,
        weight: 1.5,
        className: `blur${feature.properties.fuzzyness} blurred`,
      });
    },
    spatialStyle() {
      return (feature) => ({
        color: feature.properties.color,
        fillOpacity: 0.6,
        weight: 0,
        className: `blur${feature.properties.fuzzyness} blurred id_${feature.id}`,
      });
    },
    onEach() {
      return (feature, layer) => {
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
              this.$refs.map.mapObject.fitBounds(layer.getBounds());
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
    optionsLabels() {
      return {
        pointToLayer: this.pointToLabel,
        onEachFeature: this.onEachLabel,
      };
    },
    optionsMarkers() {
      return {
        pointToLayer: this.pointToLayer,
        onEachFeature: this.onEachPlace,
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
    onEachLabel() {
      return (feature, layer) => {
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
              this.$refs.map.mapObject.fitBounds(L.latLngBounds(feature.geometry.polygonCoords));
              this.$router.push({
                name: this.fullscreen ? 'Spatial Detail Fullscreen' : 'Spatial Detail',
                query: this.$route.query,
                params: { id: feature.id },
              });
            },
          })
          .on({
            mouseover: () => {
              document.getElementsByClassName(`id_${feature.id}`)[0].setAttribute('stroke', '#00ff51');
              document.getElementsByClassName(`id_${feature.id}`)[0].setAttribute('stroke-width', 2.5);
              document.getElementsByClassName(`id_${feature.id}`)[0].setAttribute('filter', '');
            },
          })
          .on({
            mouseout: () => {
              const filter = document.getElementsByClassName(`id_${feature.id}`)[0].classList[0];
              document.getElementsByClassName(`id_${feature.id}`)[0].setAttribute('stroke-width', 0);
              document.getElementsByClassName(`id_${feature.id}`)[0].setAttribute('filter', `url(#${filter})`);
            },
          });
      };
    },
    pointToLayer() {
      return (feature, latlng) => {
        const featCat = feature.properties.kategorie.match(/\d+/g)[0];
        const icon = new L.Icon({ iconUrl: blueMarker, iconSize: [16, 26] });

        if (Number(featCat) === 8) { icon.options.iconUrl = redMarker; }
        // eslint-disable-next-line object-shorthand
        return L.marker(latlng, { icon: icon });
      };
    },
    pointToLabel() {
      return (feature, latlng) => {
        const nE = L.latLngBounds(feature.geometry.polygonCoords).getNorthEast();
        const sW = L.latLngBounds(feature.geometry.polygonCoords).getSouthWest();
        let distanceLat = nE.lat - sW.lat;
        let distanceLng = nE.lng - sW.lng;
        if (distanceLat > 8) {
          distanceLat = 8;
          distanceLng = 8;
        }
        if (distanceLat < 1.5) {
          distanceLat = 1.5;
          distanceLng = 1.5;
        }
        const labelIcon = new L.DivIcon({
          html: `<div style="font-size:${distanceLat * 8}px;text-shadow: 2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff; color: ${feature.properties.color};">${feature.properties.key_word.stichwort}</div>`,
          iconSize: 'auto',
          className: 'label',
          iconAnchor: [distanceLat * 9, distanceLng * 9],
        });
        return L.marker(latlng, { icon: labelIcon });
      };
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
    alterSvg(polygonFeature) {
      if (!document.getElementById(polygonFeature)) {
        const fuzzyness = polygonFeature.match(/\d+/g)[0];
        const svg = this.$refs.map.mapObject.getPanes().overlayPane.firstChild;
        const svgFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        const svgBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        // Set ID attribute of filter
        svgFilter.setAttribute('id', `blur${fuzzyness}`);

        // Give room to blur to prevent clipping
        svgFilter.setAttribute('x', '-100%');
        svgFilter.setAttribute('y', '-100%');
        svgFilter.setAttribute('width', '500%');
        svgFilter.setAttribute('height', '500%');

        let scale = this.$refs.map.mapObject.getZoom() / 5;

        // Set deviation attribute of blur
        let blurring = (11 - fuzzyness) * scale;
        svgBlur.setAttribute('class', 'feGaussianBlur');
        svgBlur.setAttribute('stdDeviation', `${blurring} ${blurring}`);

        // Append blur element to filter element
        svgFilter.appendChild(svgBlur);
        // Append filter element to SVG element
        svg.appendChild(svgFilter);

        let fromZoom;
        this.$refs.map.mapObject.on('zoomend', () => {
          // eslint-disable-next-line prefer-destructuring
          const crs = this.$refs.map.mapObject.options.crs;

          // eslint-disable-next-line no-underscore-dangle
          if (fromZoom === undefined) { fromZoom = this.$refs.map.mapObject._zoom; }
          // eslint-disable-next-line no-underscore-dangle
          const toZoom = this.$refs.map.mapObject._zoom;

          scale = crs.scale(toZoom) / crs.scale(fromZoom);
          blurring = fuzzyness * scale;
          svgBlur.setAttribute('class', 'feGaussianBlur');
          svgBlur.setAttribute('stdDeviation', `${blurring} ${blurring}`);
        });
      }
    },
    changeBasemap(id) {
      this.tileProviders.forEach((i) => {
        if (i.id === id) i.visible = true;
        else i.visible = false;
      });
    },
    uncheckSpatial() {
      console.log('unchecked', this.showLayers);
      if (this.showLayers.spatial === false) { this.showLayers.labels = false; }
    },
    // foundLocations() {
    //   return this.entries.length && !this.entries.count && this.entries.features.length;
    // },
  },
  watch: {
    data: {
      handler(to) {
        console.log('to', to, this.data);
        const stichworte = {};
        to[0].features.forEach((feature) => {
          // eslint-disable-next-line prefer-template
          stichworte[feature.properties.key_word.stichwort] = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
        });
        to[0].features.forEach((feature) => {
          feature.properties.color = stichworte[feature.properties.key_word.stichwort];
        });
        console.log('stichworte', stichworte);
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

          // eslint-disable-next-line prefer-destructuring
          this.polygonCenters = JSON.parse(JSON.stringify(to[0]));
          this.polygonCenters.features.forEach((feature) => {
            const polygonCoords = [];
            let coordsFixed = [];
            feature.geometry.coordinates.forEach((coords) => {
              coords.forEach((coord) => {
                coordsFixed.push([coord[1], coord[0]]);
              });
              polygonCoords.push(coordsFixed);
              coordsFixed = [];
            });
            const centerCoords = L.polygon(feature.geometry.coordinates).getBounds().getCenter();
            feature.geometry = {
              polygonCoords,
              coordinates: [centerCoords.lat, centerCoords.lng],
              type: 'Point',
            };
          });
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
  updated() {
    const list = document.getElementsByClassName('blurred');
    for (let j = 0; j < list.length; j += 1) {
      this.alterSvg(list[j].classList[0]);
      list[j].setAttribute('filter', `url(#${list[j].classList[0]})`);
    }
  },
};
</script>

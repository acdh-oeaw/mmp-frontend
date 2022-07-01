<template>
  <div>
    <l-map
      ref="map" :style="`height: ${fullscreen && $route.name !== 'Keyword Detail Fullscreen' ? '100vh' : height + 'px'}; width: 100%; z-index: 4`"
      :bounds="bounds" @ready="onReady" @click="mapClick"
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
      <l-control position="bottomright" @ready="updateFuzzy">
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
      <l-control position="bottomleft">
        <v-card v-model="kingdoms800" v-if="showLayers.caseStudy">
          <v-card-title class="pt-0 pl-3 pb-0">Kingdoms</v-card-title>
          <v-card-text v-for="kingdom in filterKingdoms(kingdoms800.features)" :key="kingdom.properties.Name" class="pt-0 pl-5 pb-0" :style="`color:${kingdom.properties.color}`"> {{ kingdom.properties.Name }} </v-card-text>
        </v-card>
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
            <v-card-title class="pt-3 pl-5 pb-0">Select Layers</v-card-title>
            <v-card-text>
              <v-checkbox
                hide-details
                class="pa-0"
                v-model="showLayers.spatial"
                color="red darken-1"
                dense
                :disabled="!(data[0] && data[0].count) || (useCaseThree === '3')"
                v-on:change="uncheckSpatial()"
              >
                <template v-slot:label>
                  Spatial&nbsp;Coverage&nbsp;
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
                hide-details
                v-model="showLayers.labels"
                color="blue darken-1"
                dense
                :disabled="!(polygonCenters && polygonCenters.count)"
              >
                <template v-slot:label>
                  Labels
                </template>
              </v-checkbox>
              <v-checkbox
                hide-details
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
                hide-details
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
                hide-details
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
              <v-card-title class="pt-1 pl-1 pb-0">Select Additional Layers</v-card-title>
              <v-checkbox
                  hide-details
                  v-model="showLayers.caseStudy"
                  dense
                >
                  <template v-slot:label>
                    Kingdoms
                  </template>
                </v-checkbox>
                <v-checkbox
                  hide-details
                  v-model="showLayers.romanRoads"
                  dense
                >
                  <template v-slot:label>
                    Roman Roads
                  </template>
                </v-checkbox>
                <v-checkbox
                  hide-details
                  v-model="showLayers.majorTowns"
                  dense
                >
                >
                  <template v-slot:label>
                    Major Towns
                  </template>
                </v-checkbox>
                <v-card-title class="pt-1 pl-1 pb-0">Basemaps</v-card-title>
                <v-radio-group v-model="radioGroup" class="pa-0" hide-details>
                  <v-radio class="ma-0 pa-0" v-for="tileProvider in tileProviders" :key="tileProvider.id" :label="tileProvider.name" :value="tileProvider.id" v-on:change="changeBasemap(tileProvider.id)" hide-details>
                  </v-radio>
                </v-radio-group>
            </v-card-text>
            <v-card-actions class="pt-0 ma-0">
              <v-btn
                @click="menu = false"
                text
                small
                hide-details
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </l-control>
      <l-geo-json
        v-if="(data[0] && showLayers.spatial) || (useCaseThree === '3')"
        :geojson="data[0]"
        :options="{ onEachFeature: onEach }"
        :options-style="spatialStyle"
        ref="spatCov"
      />
      <v-marker-cluster ref="markerCluster"
      :options="clusterOptions" @animationend="resetSpatCov(cluster)">
        <l-geo-json
          v-if="data[0] && showLayers.spatial && showLayers.labels"
          :geojson="polygonCenters"
          :options="optionsLabels"
          ref="labels"
          @layerremove="removeMarkerCluster()"
          @layeradd="refreshMarkerCluster()"
        />
      </v-marker-cluster>
      <l-geo-json
        v-if="data[1] && showLayers.cones"
        :geojson="data[1]"
        :options="{ onEachFeature: onEach }"
        :options-style="coneStyle"
        ref="cones"
      />
      <l-geo-json
        v-if="data[1] && showLayers.cones"
        :geojson="coneOrigins"
        :options="optionsOrigins"
        ref="origins"
      />
      <l-geo-json
        v-if="data[2] && data[2].results && showLayers.places"
        :geojson="data[2].results"
        :options="optionsMarkers"
      />
      <l-geo-json
        v-if="showLayers.caseStudy"
        :geojson="kingdoms800"
        :options="optionsCaseStudies"
      />
      <l-geo-json
        v-if="showLayers.romanRoads"
        :geojson="romanRoads"
        :options-style="roadsStyle"
      />
        <l-geo-json
          v-if="showLayers.majorTowns"
          :geojson="majorTowns"
          :options="optionsTowns"
          ref="towns"
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
import * as turf from 'turf';

import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import helpers from '@/helpers';
import greenMarker from '@/assets/recolored_marker_icon.png';
import redMarker from '@/assets/red_marker_icon.png';
import blueMarker from '@/assets/blue_marker_icon.png';
import greenMarker2x from '@/assets/recolored_marker_icon_2x.png';
import kingdomsMid800Geojson from '@/assets/kingdoms_mid_800.geojson';
import kingdoms800Geojson from '@/assets/kingdoms_800.geojson';
import romanRoadsGeojson from '@/assets/RomanRoads.geojson';
import majorTownsGeojson from '@/assets/DARMC_Medieval_World_1000.geojson';

import Vue2LeafletMarkercluster from 'vue2-leaflet-markercluster';

export default {
  name: 'Leaflet',
  data: () => ({
    clusterOptions: {
      maxClusterRadius: 30,
      spiderfyDistanceMultiplier: 7,
      disableClusteringAtZoom: 8,
      showCoverageOnHover: false,
      spiderLegPolylineOptions: { weight: 3, color: '#ffffff', opacity: 1 },
      iconCreateFunction: ((cluster) => {
        const childCount = cluster.getChildCount();
        console.log(childCount);
        return new L.DivIcon({
          html: '<div>   </div>',
          className: 'marker-cluster',
          iconSize: 'auto',
        });
      }),
    },
    polygonCenters: {},
    coneOrigins: {},
    cones: {},
    stichworte: {},
    kingdomsMid800: {},
    kingdoms800: {},
    romanRoads: {},
    majorTowns: {},
    useCaseThree: window.location.href.split('=')[1],
    bounds: latLngBounds([
      [34.016242, 5.488281],
      [71.663663, 34.667969],
    ]),
    radioGroup: 1,
    url: process.env.BASE_URL,
    tileOptions: {
      maxZoom: 10,
      minZoom: 4,
    },
    tileProviders: [
      {
        name: 'Esri - World Imagery',
        id: 1,
        visible: true,
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      },
      {
        name: 'OpenStreetMap',
        id: 2,
        visible: false,
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
      {
        name: 'Digital Atlas of the Roman Empire',
        id: 3,
        visible: false,
        url: 'https://dh.gu.se/tiles/imperium/{z}/{x}/{y}.png',
        attribution:
          '© Johan Åhlfeldt, Centre for Digital Humanities, University of Gothenburg 2019. Contact: johan.ahlfeldt@lir.gu.se',
      },
    ],
    menu: false,
    relatedPlaces: [],
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
    showLayers: {
      default: {
        spatial: true,
        labels: true,
        cones: true,
        places: true,
        relatedPlaces: true,
        caseStudy: false,
        romanRoads: false,
        majorTowns: false,
      },
    },
    origins: {
      default: {},
    },
    kingdoms: {
      default: {},
    },
    cluster: {
      default: {},
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
    'v-marker-cluster': Vue2LeafletMarkercluster,
  },
  computed: {
    coneStyle() {
      return (feature) => ({
        color: feature.properties.color,
        fillOpacity: feature.properties.fillOpacity,
        weight: feature.properties.weight,
        className: `blur${feature.properties.fuzzyness} blurred id_${feature.id} cone`,
      });
    },
    spatialStyle() {
      return (feature) => ({
        color: feature.properties.color,
        fillOpacity: 0.4,
        weight: 0,
        className: `blur${feature.properties.fuzzyness} blurred id_${feature.id} spatCov`,
      });
    },
    roadsStyle() {
      return () => ({
        color: 'red',
        weight: 1.25,
      });
    },
    onEach() {
      return (feature, layer) => {
        layer
          .bindTooltip(
            `
            <div>Keyword: ${feature.properties.key_word.stichwort}</div>
            <div>Passages: ${feature.properties.stelle.length}</div>
            <div>Certainty: ${feature.properties.fuzzyness}</div>
            `,
            { permanent: false, sticky: true },
          )
          .on({
            click: (e) => {
              this.$refs.map.mapObject.fitBounds(layer.getBounds());
              console.log('click', feature, e);
              this.$router.push({
                name: this.fullscreen ? 'Spatial Detail Fullscreen' : 'Spatial Detail',
                query: this.usecase ? { 'Use Case': this.usecase } : this.$route.query,
                params: { id: feature.id },
              });
            },
          });
        // eslint-disable-next-line prefer-destructuring
        this.usecaseThree = window.location.href.split('=')[1];
        if (+this.usecaseThree === 3 && feature.properties.cone === undefined) {
          layer.setStyle({ fillOpacity: 0 });
          layer.unbindTooltip();
        }
      };
    },
    onEachCase() {
      return (feature, layer) => {
        // eslint-disable-next-line prefer-destructuring
        const type = feature.geometry.type;
        console.log('kingdom', feature);
        if (type === 'MultiPolygon') {
          layer.setStyle({
            fillOpacity: 0.15,
            color: `${feature.properties.color}`,
          });
          if (feature.properties.Dashed === 'true') {
            layer.setStyle({
              dashArray: '10 10',
            });
          }
        }
      };
    },
    optionsLabels() {
      return {
        pointToLayer: this.pointToLabel,
        onEachFeature: this.onEachLabel,
      };
    },
    optionsOrigins() {
      return {
        pointToLayer: this.pointToTown,
        onEachFeature: this.onEachOrigin,
      };
    },
    optionsTowns() {
      return {
        pointToLayer: this.pointToTown,
        onEachFeature: this.onEachTown,
      };
    },
    optionsCaseStudies() {
      return {
        pointToLayer: this.pointToCase,
        onEachFeature: this.onEachCase,
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
            <div>Certainty: ${feature.properties.fuzzyness}</div>
            `,
            { permanent: false, sticky: true },
          )
          .on({
            click: (e) => {
              console.log('click', feature, e);
              this.$refs.map.mapObject.fitBounds(L.latLngBounds(feature.geometry.polygonCoords));
              this.$router.push({
                name: this.fullscreen ? 'Spatial Detail Fullscreen' : 'Spatial Detail',
                query: this.usecase ? { 'Use Case': this.usecase } : this.$route.query,
                params: { id: feature.id },
              });
            },
          })
          .on({
            mouseover: () => {
              this.highlightPoly(feature, 'cone', '#f6fa07');
            },
          })
          .on({
            mouseout: () => {
              this.playdownPoly(feature, 'cone');
            },
          });
      };
    },
    onEachTown() {
      return (feature, layer) => {
        layer
          .bindTooltip(
            `<div>Origin: ${feature.properties.Name}</div>`,
          );
      };
    },
    onEachOrigin() {
      return (feature, layer) => {
        layer
          .bindTooltip(
            `<div>Town: ${feature.properties.Name}</div>`,
          )
          .on({
            mouseover: () => {
              if (typeof feature.id === 'number') { feature.id = [feature.id]; }
              feature.id.forEach((id) => {
                document.getElementsByClassName(`id_${id} cone`)[0].setAttribute('stroke', '#e8fc05');
                document.getElementsByClassName(`id_${id} cone`)[0].setAttribute('stroke-width', 3.5);
                document.getElementsByClassName(`id_${id} cone`)[0].setAttribute('filter', '');
                if (this.$refs.spatCov !== undefined) {
                  console.log(this.$refs.cones);
                  // eslint-disable-next-line
                  Object.values(this.$refs.spatCov.mapObject._layers).forEach((i) => {
                    if (i.feature.id === id) {
                      i.bringToFront();
                    } else {
                      i.bringToBack();
                    }
                  });
                }
              });
            },
          })
          .on({
            mouseout: () => {
              feature.id.forEach((id) => {
                const filter = document.getElementsByClassName(`id_${id}`)[0].classList[0];
                document.getElementsByClassName(`id_${id} cone`)[0].setAttribute('stroke-width', 0);
                document.getElementsByClassName(`id_${id} cone`)[0].setAttribute('filter', `url(#${filter})`);
                if (this.$refs.spatCov !== undefined) {
                  // eslint-disable-next-line
                  Object.values(this.$refs.spatCov.mapObject._layers).forEach((i) => {
                    if (i.feature.id === id) { i.bringToBack(); }
                  });
                }
              });
            },
          });
      };
    },
    pointToLayer() {
      return (feature, latlng) => {
        console.log(feature, 'API');
        const featCat = feature.properties.kategorie.match(/\d+/g)[0];
        const icon = new L.Icon({ iconUrl: blueMarker, iconSize: [16, 26] });

        if (Number(featCat) === 8) { icon.options.iconUrl = redMarker; }
        // eslint-disable-next-line object-shorthand
        return L.marker(latlng, { icon: icon });
      };
    },
    pointToTown() {
      return (feature, latlng) => {
        let circleMarker;
        if (latlng.lat !== 0 && latlng.lng !== 0) {
          if (feature.properties.cone === 'cone') {
            circleMarker = L.circleMarker(latlng, {
              radius: 7,
              color: 'red',
              fillOpacity: 1,
              fillColor: 'red',
            });
          } else {
            circleMarker = L.circleMarker(latlng, { radius: 5 });
          }
        }
        return circleMarker;
      };
    },
    pointToLabel() {
      return (feature, latlng) => {
        const nE = L.latLngBounds(feature.geometry.polygonCoords).getNorthEast();
        const sW = L.latLngBounds(feature.geometry.polygonCoords).getSouthWest();
        const distanceLat = nE.lat - sW.lat;
        const distanceLng = nE.lng - sW.lng;
        // const seeArea = GeometryUtil.geodesicArea(L.latLngBounds(feature.geometry.polygonCoords));
        console.log(L.latLngBounds(feature.geometry.polygonCoords), 'dist1');
        let dist;
        let vert = '';
        if (distanceLat > distanceLng) {
          dist = distanceLat;
          vert = 'writing-mode:vertical-rl;';
        } else { dist = distanceLng; }
        console.log(dist, 'dist');
        if (dist > 12) {
          dist = 12;
        }
        if (dist < 4) {
          dist = 4;
        }
        const labelIcon = new L.DivIcon({
          html: `<div class="labelText" style="position:relative;transform:translate(-50%,-50%);${vert}font-size:${dist * 5}px;text-shadow: 2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff; color: ${feature.properties.color};">${feature.properties.key_word.stichwort}</div>`,
          iconSize: 'auto',
          className: 'label',
        });
        return L.marker(latlng, { icon: labelIcon });
      };
    },
    pointToCase() {
      return (feature, latlng) => {
        const labelIcon = new L.DivIcon({
          html: `<div style="font-size:15px;text-shadow: 2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;text-align: center;">${feature.properties.Name}</div>`,
          iconSize: 'auto',
          className: 'label',
          iconAnchor: [15, 15],
        });
        return L.marker(latlng, { icon: labelIcon });
      };
    },
  },
  methods: {
    onReady() {
      this.$refs.markerCluster.mapObject.refreshClusters();
    },
    mapClick(e) {
      const { lat, lng } = e.latlng;
      const point = turf.point([lng, lat]);
      this.cones.features.forEach((p) => {
        if (turf.booleanPointInPolygon(point, p)) {
          /* do whatever you want with your clicked polygon */
          console.log(p, 'clicki');
          this.$router.push({
            name: this.fullscreen ? 'Spatial Detail Fullscreen' : 'Spatial Detail',
            query: this.usecase ? { 'Use Case': this.usecase } : this.$route.query,
            params: { id: p.id },
          });
        }
      });
    },
    highlightPoly(feature, type, color) {
      document.getElementsByClassName(`id_${feature.id} ${type}`)[0].setAttribute('stroke', color);
      document.getElementsByClassName(`id_${feature.id} ${type}`)[0].setAttribute('stroke-width', 3.5);
      document.getElementsByClassName(`id_${feature.id} ${type}`)[0].setAttribute('filter', '');
      let spatCov;
      let layers;
      if (type === 'spatCov') {
        layers = this.$refs.spatCov;
      } else if (type === 'cone') { layers = this.$refs.cones; }
      if (layers !== undefined) {
        // eslint-disable-next-line
         Object.values(layers.mapObject._layers).forEach((i) => {
          const classNames = i.options.className.split(' ');
          if ((i.feature.id === feature.id) && (classNames[classNames.length - 1] === type)) {
            spatCov = i;
          }
        });
      }
      if (spatCov !== undefined) {
        spatCov.bringToFront();
      }
      // eslint-disable-next-line
      const origins = this.$refs.origins.mapObject._layers;
      Object.values(origins).forEach((origin) => {
        console.log(origin.feature.id, 'spatCov');
        if (origin.feature.id.includes(feature.id)) {
          console.log(origin, 'spatCov2');
          origin.openTooltip();
        }
      });
    },
    playdownPoly(feature, type) {
      const filter = document.getElementsByClassName(`id_${feature.id} ${type}`)[0].classList[0];
      document.getElementsByClassName(`id_${feature.id} ${type}`)[0].setAttribute('stroke-width', 0);
      if (filter !== 'blur1') {
        document.getElementsByClassName(`id_${feature.id} ${type}`)[0].setAttribute('filter', `url(#${filter})`);
      } else {
        document.getElementsByClassName(`id_${feature.id} ${type}`)[0].setAttribute('stroke-width', 1.5);
        document.getElementsByClassName(`id_${feature.id} ${type}`)[0].setAttribute('stroke', feature.properties.color);
      }
      let spatCov;
      let layers;
      if (type === 'spatCov') {
        layers = this.$refs.spatCov;
      } else if (type === 'cone') { layers = this.$refs.cones; }
      if (layers !== undefined) {
        // eslint-disable-next-line
        Object.values(layers.mapObject._layers).forEach((i) => {
          const classNames = i.options.className.split(' ');
          if ((i.feature.id === feature.id) && (classNames[classNames.length - 1] === type)) {
            spatCov = i;
          }
        });
      }
      if (spatCov !== undefined) {
        spatCov.bringToBack();
      }
      // eslint-disable-next-line
      const origins = this.$refs.origins.mapObject._layers;
      Object.values(origins).forEach((origin) => {
        console.log(origin.feature.id, 'spatCov');
        if (origin.feature.id.includes(feature.id)) {
          console.log(origin, 'spatCov2');
          origin.closeTooltip();
        }
      });
    },
    filterKingdoms(arr) {
      const filteredKingdoms = [];
      const kingdomNames = [];
      let counter = 1;
      arr.forEach((feature) => {
        if (feature.geometry.type === 'MultiPolygon' && !kingdomNames.includes(feature.properties.Name)) {
          kingdomNames.push(feature.properties.Name);
          filteredKingdoms.push(feature);
        }
        if (feature.properties.color === undefined) {
          if (!Object.keys(this.kingdoms).includes(feature.properties.Name)) {
            const hue = counter * 137.508;
            // eslint-disable-next-line prefer-template
            this.kingdoms[feature.properties.Name] = `hsl(${hue},50%,75%)`;
            counter += 1;
          }
          feature.properties.color = this.kingdoms[feature.properties.Name];
        }
      });
      return filteredKingdoms;
    },
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
        console.log('map', this.$refs.map);

        // Set deviation attribute of blur
        let blurring = (fuzzyness) * scale;
        svgBlur.setAttribute('class', 'feGaussianBlur');
        svgBlur.setAttribute('stdDeviation', `${blurring}`);

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
    updateFuzzy() {
      const list = document.getElementsByClassName('blurred');
      for (let j = 0; j < list.length; j += 1) {
        this.alterSvg(list[j].classList[0]);
        if (list[j].classList[0] !== 'blur1') {
          list[j].setAttribute('filter', `url(#${list[j].classList[0]})`);
        } else {
          list[j].setAttribute('stroke-width', 1.5);
        }
      }
    },
    changeBasemap(id) {
      this.tileProviders.forEach((i) => {
        if (i.id === id) i.visible = true;
        else i.visible = false;
      });
    },
    removeMarkerCluster() {
      this.$refs.markerCluster.mapObject.clearLayers();
    },
    resetSpatCov() {
      const list = document.getElementsByClassName('cone');
      Array.from(list).forEach((spatCov) => {
        const filter = spatCov.classList[0];
        // eslint-disable-next-line
        const color = spatCov.attributes.stroke.nodeValue;
        spatCov.setAttribute('stroke-width', 0);
        if (filter !== 'blur1') {
          spatCov.setAttribute('filter', `url(#${filter})`);
        } else {
          spatCov.setAttribute('stroke-width', 1.5);
          spatCov.setAttribute('stroke', color);
        }
      });
    },
    refreshMarkerCluster() {
      console.log('label add');
      this.$refs.markerCluster.mapObject.addLayer(this.$refs.labels.mapObject);
      this.$refs.map.mapObject.addLayer(this.$refs.markerCluster.mapObject);
    },
    uncheckSpatial() {
      if (this.showLayers.spatial === false) { this.showLayers.labels = false; }
    },
    townsToFront() {
      if (typeof this.$refs.towns !== 'undefined' && typeof this.$refs.towns.mapObject !== 'undefined') {
        this.$refs.towns.mapObject.bringToFront();
      }
      if (typeof this.$refs.origins !== 'undefined' && typeof this.$refs.origins.mapObject !== 'undefined') {
        this.$refs.origins.mapObject.bringToFront();
      }
    },
    // foundLocations() {
    //   return this.entries.length && !this.entries.count && this.entries.features.length;
    // },
  },
  watch: {
    data: {
      handler(to) {
        console.log('to', to, this.useCaseThree);
        console.log('to', to, this.data);
        this.cones = JSON.parse(JSON.stringify(to[1]));
        to[0].features.forEach((feature) => {
          if (feature.properties.color === undefined) {
            if (!Object.keys(this.stichworte).includes(feature.properties.key_word.stichwort)) {
              const max = 50;
              const min = 200;
              const orange = Math.floor(Math.random() * (max - min + 1)) + min;
              // eslint-disable-next-line prefer-template
              this.stichworte[feature.properties.key_word.stichwort] = `rgb(255,${orange},0)`;
              /* random colors:
              this.stichworte[feature.properties.key_word.stichwort] = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
              */
            }
            feature.properties.color = this.stichworte[feature.properties.key_word.stichwort];
          }
        });
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

          this.kingdomsMid800 = JSON.parse(JSON.stringify(kingdomsMid800Geojson));
          this.kingdoms800 = JSON.parse(JSON.stringify(kingdoms800Geojson));
          this.romanRoads = JSON.parse(JSON.stringify(romanRoadsGeojson));
          this.majorTowns = JSON.parse(JSON.stringify(majorTownsGeojson));

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
            feature.properties.cone = 'spatCov';
          });

          this.coneOrigins = JSON.parse(JSON.stringify(to[1]));
          this.coneOrigins.features.forEach((feature) => {
            let lat = 0;
            let lng = 0;
            feature.properties.texts.forEach((text) => {
              if (text.places.length > 0) {
                lng = text.places[0].lat;
                lat = text.places[0].lng;
                feature.properties.Name = text.places[0].name;
                feature.properties.cone = 'cone';
              }
            });
            feature.geometry = {
              coordinates: [lat, lng],
              type: 'Point',
            };
          });
          const coordsOrigins = {};
          let a;
          this.coneOrigins.features.forEach((feature) => {
            if (JSON.stringify(feature.geometry.coordinates) !== '[null,null]') { a = feature.geometry.coordinates; } else { a = [0, 0]; }
            let count = 0;
            if (Object.keys(coordsOrigins).length === 0) { coordsOrigins[a] = [feature.id]; }
            Object.keys(coordsOrigins).forEach((coord) => {
              if (L.latLng(a).distanceTo(coord.split(',')) > 0) {
                count += 1;
              }
            });
            if (count === Object.keys(coordsOrigins).length) {
              coordsOrigins[a] = [feature.id];
            } else {
              const arr = Object.values(coordsOrigins[a]);
              if (!arr.includes(feature.id)) { arr.push(feature.id); }
              coordsOrigins[a] = arr;
            }
            Object.keys(coordsOrigins).forEach((coord) => {
              if (L.latLng(a).distanceTo(coord.split(',')) === 0) {
                feature.id = coordsOrigins[coord];
              }
            });
            if (feature.properties.color === undefined) {
              if (!Object.keys(this.origins).includes(feature.properties.Name)) {
                const max1 = 65;
                const min1 = 45;
                const hue = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;
                const max2 = 80;
                const min2 = 60;
                const x = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
                // eslint-disable-next-line prefer-template
                this.origins[feature.properties.Name] = `hsl(${hue},100%,${x}%)`;
              }
            }
            if (feature.properties.texts[0].places.length > 0) {
              feature.properties.color = this.origins[feature.properties.texts[0].places[0].name];
            }
          });
          const allCoordsOrigins = [];
          Object.values(coordsOrigins).forEach((ar) => {
            allCoordsOrigins.push(...ar);
          });
          console.log(this.coneOrigins, allCoordsOrigins, 'coneOrigins');
          to[1].features.forEach((feature) => {
            feature.properties.cone = 'cone';
            feature.properties.texts.forEach((text) => {
              if (text.places.length > 0) {
                feature.properties.color = this.origins[text.places[0].name];
                if (text.places[0].lat !== null && text.places[0].lng !== null) {
                  feature.properties.fillOpacity = 0.4;
                  feature.properties.weight = 1.5;
                }
              }
            });
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
    this.updateFuzzy();
    this.townsToFront();
  },
};
</script>

<style>
  .marker-cluster div {
    background: orange;
    color: white;
    border-radius: 50%;
    text-align: center;
    border-style: solid;
    padding: 10px;
  }
</style>

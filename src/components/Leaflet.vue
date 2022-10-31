<template>
  <div>
    <l-map
      ref="map"
      :style="`height: ${
        fullscreen && $route.name !== 'Keyword Detail Fullscreen' ? '100vh' : height + 'px'
      }; width: 100%; z-index: 4`"
      :bounds="bounds"
      :options="{ zoomControl: false }"
      @ready="onReady"
      @click="mapClick"
      @zoomend="setZoomLevel"
    >
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :attribution="tileProvider.attribution"
        layer-type="base"
        :options="tileOptions"
      />
      <l-control position="bottomright" @ready="updateFuzzy">
        <v-btn
          fab
          small
          :to="{
            name: fullscreen ? 'Map' : 'Map Fullscreen',
            query: usecase ? addParamsToQuery({ 'Use Case': usecase }) : $route.query,
          }"
        >
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>
      </l-control>
      <l-control position="bottomleft">
        <v-card v-if="showLayers.caseStudy && $route.query['Use Case']" v-model="kingdomsLayer">
          <v-card-title class="pt-0 pl-3 pb-0">Legend: Kingdoms</v-card-title>
          <v-card-text
            v-for="kingdom in filterKingdoms(kingdomsLayer.features)"
            :key="kingdom.properties.Name"
            class="pt-0 pl-5 pb-0"
            :style="`color:${kingdom.properties.color}`"
          >
            {{ kingdom.properties.Name }}
          </v-card-text>
        </v-card>
      </l-control>
      <l-control position="topright">
        <v-menu v-model="menu" :close-on-content-click="false" left>
          <template #activator="{ on, attrs }">
            <v-btn fab small v-bind="attrs" v-on="on">
              <v-icon>mdi-layers-triple</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="pt-3 pl-5 pb-0">Select Layers</v-card-title>
            <v-card-text>
              <v-checkbox
                v-model="showLayers.spatial"
                hide-details
                class="pa-0"
                color="red darken-1"
                dense
                :disabled="!(data[0] && data[0].count) || $route.query['Use Case'] === '3'"
              >
                <template #label>
                  Spatial&nbsp;Coverage&nbsp;
                  <v-chip color="red darken-1" dark small :disabled="!data[0] || !data[0].count">
                    <template v-if="loading">
                      <v-progress-circular indeterminate :size="15" :width="2" />
                    </template>
                    <template v-else>
                      {{ data[0].count }}
                    </template>
                  </v-chip>
                </template>
              </v-checkbox>
              <v-checkbox
                v-model="showLayers.labels"
                hide-details
                color="blue darken-1"
                dense
                :disabled="!(polygonCenters && polygonCenters.count)"
              >
                <template #label> Labels </template>
              </v-checkbox>
              <v-checkbox
                v-model="showLayers.cones"
                hide-details
                color="yellow darken-1"
                dense
                :disabled="!(data[1] && data[1].count)"
              >
                <template #label>
                  Cones &nbsp;
                  <v-chip color="yellow darken-1" small :disabled="!data[1] || !data[1].count">
                    <template v-if="loading">
                      <v-progress-circular indeterminate :size="15" :width="2" />
                    </template>
                    <template v-else>
                      {{ data[1].count }}
                    </template>
                  </v-chip>
                </template>
              </v-checkbox>
              <v-checkbox
                v-model="showLayers.places"
                hide-details
                color="green lighten-1"
                dense
                :disabled="!(data[2] && data[2].count)"
              >
                <template #label>
                  Places &nbsp;
                  <v-chip color="green lighten-1" dark small :disabled="!data[2] || !data[2].count">
                    <template v-if="loading">
                      <v-progress-circular indeterminate :size="15" :width="2" />
                    </template>
                    <template v-else-if="data[2]">
                      {{ data[2].count }}
                    </template>
                    <template v-else> 0 </template>
                  </v-chip>
                </template>
              </v-checkbox>
              <v-checkbox
                v-model="showLayers.relatedPlaces"
                hide-details
                color="green lighten-1"
                dense
                :disabled="!relatedPlaces.length"
              >
                <template #label>
                  Related&nbsp;Places &nbsp;
                  <v-chip color="green lighten-1" dark small :disabled="!relatedPlaces.length">
                    <v-progress-circular v-if="loading" indeterminate :size="15" :width="2" />
                    <template v-else>
                      {{ relatedPlaces.length }}
                    </template>
                  </v-chip>
                </template>
              </v-checkbox>
              <v-card-title class="pt-1 pl-1 pb-0">Select Additional Layers</v-card-title>
              <v-checkbox
                v-model="showLayers.caseStudy"
                hide-details
                dense
                :disabled="!$route.query['Use Case']"
              >
                <template #label> Kingdoms </template>
              </v-checkbox>
              <v-checkbox v-model="showLayers.romanRoads" hide-details dense>
                <template #label> Roman Roads </template>
              </v-checkbox>
              <v-checkbox
                v-model="showLayers.majorTowns"
                hide-details
                dense
                :disabled="!$route.query['Use Case']"
              >
                >
                <template #label> Major Towns </template>
              </v-checkbox>
              <v-card-title class="pt-1 pl-1 pb-0">Basemaps</v-card-title>
              <v-radio-group v-model="radioGroup" class="pa-0" hide-details>
                <v-radio
                  v-for="tileProvider in tileProviders"
                  :key="tileProvider.id"
                  class="ma-0 pa-0"
                  :label="tileProvider.name"
                  :value="tileProvider.id"
                  hide-details
                  @change="changeBasemap(tileProvider.id)"
                >
                </v-radio>
              </v-radio-group>
            </v-card-text>
            <v-card-actions class="pt-0 ma-0">
              <v-btn text small hide-details @click="menu = false"> Close </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </l-control>
      <l-geo-json
        v-if="data[0] && showLayers.spatial && $root.$refs.mapWrap.$route.query['Use Case'] !== '3'"
        ref="spatCov"
        :geojson="data[0]"
        :options="{ onEachFeature: onEach }"
        :options-style="spatialStyle"
      />
      <LeafletMarkercluster
        ref="markerCluster"
        :options="clusterOptions"
        @animationend="resetSpatCov(cluster)"
      >
        <l-geo-json
          v-if="data[0] && showLayers.labels"
          ref="labels"
          :geojson="polygonCenters"
          :options="optionsLabels"
          @layerremove="removeMarkerCluster()"
          @layeradd="refreshMarkerCluster()"
        />
      </LeafletMarkercluster>
      <l-geo-json
        v-if="data[1] && showLayers.cones"
        ref="cones"
        :geojson="data[1]"
        :options="{ onEachFeature: onEach }"
        :options-style="coneStyle"
      />
      <l-geo-json
        v-if="data[1] && showLayers.cones"
        ref="origins"
        :geojson="coneOrigins"
        :options="optionsOrigins"
      />
      <l-geo-json
        v-if="data[2] && data[2].results && showLayers.places"
        :geojson="data[2].results"
        :options="optionsMarkers"
      />
      <l-geo-json
        v-if="showLayers.caseStudy && $route.query['Use Case']"
        :geojson="kingdomsLayer"
        :options="optionsCaseStudies"
      />
      <l-geo-json v-if="showLayers.romanRoads" :geojson="romanRoads" :options-style="roadsStyle" />
      <l-geo-json
        v-if="showLayers.majorTowns"
        ref="towns"
        :geojson="majorTowns"
        :options="optionsTowns"
      />
      <l-geo-json
        v-if="showLayers.langobardenPoints"
        ref="langobarden"
        :geojson="langobardenPoints"
        :options="optionsLangobarden"
      />
      <template v-if="showLayers.relatedPlaces">
        <l-marker
          v-for="place in relatedPlaces"
          :key="place.url"
          :lat-lng="returnLatLng(place.coords.coordinates)"
          @click="
            $router.push({
              name: fullscreen ? 'Place Detail Fullscreen' : 'Place Detail',
              query: $route.query,
              params: { id: getIdFromUrl(place.url) },
            })
          "
        >
          <l-tooltip>
            <div>Name: {{ place.name }}</div>
            <div v-if="place.name_antik">Ancient Name: {{ place.name_antik }}</div>
          </l-tooltip>
        </l-marker>
      </template>
      <l-control position="topleft">
        <v-slider
          v-model="zoom"
          min="4"
          max="10"
          vertical
          track-color="white"
          color="grey"
          ticks="always"
          tick-size="4"
          style="position: absolute; z-index: 1001"
          append-icon="mdi-magnify-plus-outline"
          prepend-icon="mdi-magnify-minus-outline"
          thumb-label="always"
          @click:append="zoomIn"
          @click:prepend="zoomOut"
          @change="changeZoomLevel"
        />
      </l-control>
    </l-map>
    <v-overlay absolute class="overlay" opacity=".2" :value="loading || !data.some((d) => d.count)">
      <h1 v-if="!loading" class="no-nodes">No locations found!</h1>
      <h1 v-else>
        <v-progress-circular indeterminate color="#0F1226" />
      </h1>
    </v-overlay>
    <router-view />
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header> Layer sources </v-expansion-panel-header>
        <v-expansion-panel-content class="ma-2" v-html="sources"> </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
// `leaflet.markercluster.placementstrategies` is a sideeffect import depending on
// `leaflet.markercluster` already being present, so we need to disable import sorting.
// eslint-disable-next-line simple-import-sort/imports
import 'leaflet/dist/leaflet.css';

import * as turf from '@turf/turf';
import * as L from 'leaflet';
import { Icon, latLng, latLngBounds } from 'leaflet';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { LControl, LGeoJson, LMap, LMarker, LTileLayer, LTooltip } from 'vue2-leaflet';
import LeafletMarkercluster from 'vue2-leaflet-markercluster';
import 'leaflet.markercluster.placementstrategies';

import blueMarker from '@/assets/blue_marker_icon.png';
import greenMarker from '@/assets/recolored_marker_icon.png';
import greenMarker2x from '@/assets/recolored_marker_icon_2x.png';
import redMarker from '@/assets/red_marker_icon.png';
import majorTowns800 from '@/assets/geojson/darmc-medieval-world-814.json';
import majorTowns1000 from '@/assets/geojson/darmc-medieval-world-1000.json';
import kingdoms800 from '@/assets/geojson/kingdoms-800.json';
import kingdomsMid800 from '@/assets/geojson/kingdoms-mid-800.json';
import langobards from '@/assets/geojson/langobards.json';
import romanRoads from '@/assets/geojson/roman-roads.json';
import helpers from '@/helpers';

export default {
  name: 'Leaflet',
  components: {
    LMap,
    LGeoJson,
    LTileLayer,
    LControl,
    LMarker,
    LTooltip,
    LeafletMarkercluster,
  },
  mixins: [helpers],
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
        langobardenPoints: false,
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
  data: () => ({
    zoom: 4,
    spatCovToAdd: {},
    strokeColor: '',
    clusterOptions: {
      maxClusterRadius: 30,
      disableClusteringAtZoom: 7,
      spiderfyDistanceMultiplier: 2,
      spiderfyDistanceSurplus: 50,
      firstCircleElements: 0.1,
      elementsMultiplier: 100,
      showCoverageOnHover: false,
      elementsPlacementStrategy: 'clock',
      helpingCircles: false,
      spiderLegPolylineOptions: { weight: 5, color: '#ffffff', opacity: 1 },

      iconCreateFunction: () => {
        return new L.DivIcon({
          html: '<div>   </div>',
          className: 'marker-cluster',
          iconSize: 'auto',
        });
      },
    },
    polygonCenters: {},
    coneOrigins: {},
    cones: {},
    spatial: {},
    stichworte: {},
    kingdomsLayer: {},
    sources: '',
    romanRoads: {},
    majorTowns: {},
    langobardenPoints: JSON.parse(JSON.stringify(langobards)),
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
            { permanent: false, sticky: true }
          )
          .on({
            click: () => {
              this.$router.push({
                name: this.fullscreen ? 'Spatial Detail Fullscreen' : 'Spatial Detail',
                query: this.usecase
                  ? this.addParamsToQuery({ 'Use Case': this.usecase })
                  : this.$route.query,
                params: { id: feature.id },
              });
            },
          });
        if (this.$route.query['Use Case'] === '3' && feature.properties.cone === undefined) {
          layer.setStyle({ fillOpacity: 0 });
          layer.unbindTooltip();
        }
      };
    },
    onEachCase() {
      return (feature, layer) => {
        const type = feature.geometry.type;
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
    optionsLangobarden() {
      return {
        pointToLayer: this.pointToLango,
        onEachFeature: this.onEachLango,
      };
    },
    onEachPlace() {
      return (feature, layer) => {
        layer
          .bindTooltip(
            `
            <div>Name: ${feature.properties.name}</div>
            ${
              feature.properties.name_antik
                ? `<div>Ancient Name: ${feature.properties.name_antik}</div>`
                : ''
            }
            `,
            { permanent: false, sticky: true }
          )
          .on({
            click: () => {
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
            { permanent: false, sticky: true }
          )
          .on({
            click: () => {
              this.$router.push({
                name: this.fullscreen ? 'Spatial Detail Fullscreen' : 'Spatial Detail',
                query: this.usecase
                  ? this.addParamsToQuery({ 'Use Case': this.usecase })
                  : this.$route.query,
                params: { id: feature.id },
              });
              // this.$refs.map.mapObject.fitBounds(L.latLngBounds(feature.geometry.polygonCoords));
              console.log(this.spatCovToAdd);
              if (this.spatCovToAdd.options) {
                this.disableSpatCov();
              }
              this.enableSpatCov(feature.id);
              this.spatCovToAdd.bringToFront();
              console.log(feature.id, this.spatCovToAdd, 'test');
            },
          })
          .on({
            mouseover: () => {
              this.highlightPoly(feature.id, 'cone', '#f6fa07');
            },
          })
          .on({
            mouseout: () => {
              this.playdownPoly(feature.id, 'cone');
              if (this.spatCovToAdd.options) {
                this.disableSpatCov();
              }
            },
          });
      };
    },
    onEachTown() {
      return (feature, layer) => {
        layer.bindTooltip(`<div>Town: ${feature.properties.Name}</div>`);
      };
    },
    onEachLango() {
      return (feature, layer) => {
        layer.bindTooltip(
          `<div>Location: ${feature.properties['Location (Location)']}</div>
             <div>Findings: ${feature.properties.Findings}</div>
             <div>No burials total (SUM): ${feature.properties['No burials total (SUM)']}</div>`
        );
      };
    },
    onEachOrigin() {
      return (feature, layer) => {
        layer
          .bindTooltip(`<div>Origin: ${feature.properties.Name}</div>`)
          .on({
            mouseover: () => {
              if (typeof feature.id === 'number') {
                feature.id = [feature.id];
              }
              feature.id.forEach((id) => {
                document
                  .getElementsByClassName(`id_${id} cone`)[0]
                  .setAttribute('stroke', '#e8fc05');
                document
                  .getElementsByClassName(`id_${id} cone`)[0]
                  .setAttribute('stroke-width', 3.5);
                document.getElementsByClassName(`id_${id} cone`)[0].setAttribute('filter', '');
                if (this.$refs.cones !== undefined) {
                  Object.values(this.$refs.cones.mapObject._layers).forEach((i) => {
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
                document
                  .getElementsByClassName(`id_${id} cone`)[0]
                  .setAttribute('filter', `url(#${filter})`);
                if (this.$refs.cones !== undefined) {
                  Object.values(this.$refs.cones.mapObject._layers).forEach((i) => {
                    if (i.feature.id === id) {
                      i.bringToBack();
                    }
                  });
                }
              });
            },
          });
      };
    },
    pointToLayer() {
      return (feature, latlng) => {
        const featCat = feature.properties.kategorie.match(/\d+/g)[0];
        const icon = new L.Icon({ iconUrl: blueMarker, iconSize: [16, 26] });

        if (Number(featCat) === 8) {
          icon.options.iconUrl = redMarker;
        }

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
    pointToLango() {
      return (feature, latlng) => {
        const circleMarker = L.circleMarker(latlng, { radius: 5, color: 'white' });
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
        let dist;
        let vert = '';
        if (distanceLat > distanceLng) {
          dist = distanceLat;
          vert = 'writing-mode:vertical-rl;';
        } else {
          dist = distanceLng;
        }
        if (dist > 12) {
          dist = 12;
        }
        if (dist < 4) {
          dist = 4;
        }
        const labelIcon = new L.DivIcon({
          html: `<div class="labelText ${
            feature.id
          }" style="position:relative;transform:translate(-50%,-50%);${vert}font-size:${
            dist * 5
          }px;text-shadow: 2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff; color: ${
            feature.properties.color
          };">${feature.properties.key_word.stichwort}</div>`,
          iconSize: 'auto',
          className: 'label',
        });
        return L.marker(latlng, { icon: labelIcon, autoPanOnFocus: false, riseOnHover: true });
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
  watch: {
    data: {
      handler(to) {
        console.log('to', to, this.data);
        this.spatial = JSON.parse(JSON.stringify(to[0]));
        this.cones = JSON.parse(JSON.stringify(to[1]));
        to[0].features.forEach((feature) => {
          if (feature.properties.color === undefined) {
            if (!Object.keys(this.stichworte).includes(feature.properties.key_word.stichwort)) {
              const r = Math.floor(Math.random() * (255 - 200 + 1)) + 200;
              const g = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
              const b = Math.floor(Math.random() * (255 - 0 + 1)) + 0;

              this.stichworte[feature.properties.key_word.stichwort] = `rgb(${r},${g},${b})`;
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
            allCoords = allCoords.concat(
              to[2].results?.features.map((x) => x.geometry?.coordinates)
            );
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

          const allPlaces = places.texts.spatial
            .concat(places.texts.cones)
            .flat(2)
            .filter((x) => x?.coords?.coordinates);

          console.log('allPlaces', allPlaces);
          this.relatedPlaces = this.removeDuplicates(allPlaces, ['url']);
          const relatedCoords = this.relatedPlaces.map((x) => x.coords.coordinates);
          this.bounds = this.getBounds(allCoords.concat(relatedCoords));

          this.romanRoads = JSON.parse(JSON.stringify(romanRoads));

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
            if (JSON.stringify(feature.geometry.coordinates) !== '[null,null]') {
              a = feature.geometry.coordinates;
            } else {
              a = [0, 0];
            }
            let count = 0;
            if (Object.keys(coordsOrigins).length === 0) {
              coordsOrigins[a] = [feature.id];
            }
            Object.keys(coordsOrigins).forEach((coord) => {
              if (L.latLng(a).distanceTo(coord.split(',')) > 0) {
                count += 1;
              }
            });
            if (count === Object.keys(coordsOrigins).length) {
              coordsOrigins[a] = [feature.id];
            } else {
              const arr = Object.values(coordsOrigins[a]);
              if (!arr.includes(feature.id)) {
                arr.push(feature.id);
              }
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

        console.log(this.$route.query['Use Case'], 'hereee');

        console.log(this.$store.state, this.$route.query['Use Case'], 'study');

        const study = this.$route.query['Use Case'];
        if (study) {
          const url = `https://mmp.acdh-dev.oeaw.ac.at/api/usecase/${study}?format=json`;
          fetch(url)
            .then((res) => res.json())
            .then((jsonRes) => {
              const layer = jsonRes.custom_layer;
              if (layer === '800') {
                this.kingdomsLayer = JSON.parse(JSON.stringify(kingdoms800));
                this.majorTowns = JSON.parse(JSON.stringify(majorTowns800));
                this.sources =
                  'Kingdoms:<br> Scientific direction Thomas Lienhard (Paris 1, LaMOP),<br> Production and classification of data, computer developments by Pierre Brochard (CNRS, LaMOP), Mathieu Beaud (Paris 1, LaMOP).<br><br> Roman Roads & Major Towns:<br> Michael McCormick et al. (eds.), The Digital Atlas of Roman and Medieval Civilizations, Cambridge (Massachusetts), 2007.';
              } else if (layer === '850') {
                this.kingdomsLayer = JSON.parse(JSON.stringify(kingdomsMid800));
                this.majorTowns = JSON.parse(JSON.stringify(majorTowns1000));
                this.sources =
                  'Kingdoms:<br> Scientific direction Thomas Lienhard (Paris 1, LaMOP),<br> Production and classification of data, computer developments by Pierre Brochard (CNRS, LaMOP), Mathieu Beaud (Paris 1, LaMOP).<br><br> Roman Roads & Major Towns:<br> Michael McCormick et al. (eds.), The Digital Atlas of Roman and Medieval Civilizations, Cambridge (Massachusetts), 2007.';
              }
            })
            .catch((err) => {
              console.error(err);
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.sources =
            'Roman Roads:<br> Michael McCormick et al. (eds.), The Digital Atlas of Roman and Medieval Civilizations, Cambridge (Massachusetts), 2007.';
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.$root.$refs.map = this;
    // this is a fix for missing marker icons that was provided on the vue-leaflet documentation, i changed it up for custom icons

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
    this.showLayers.langobardenPoints = this.$route.query['Use Case'] === '15';
  },
  methods: {
    zoomOut() {
      this.zoom = this.zoom - 1 || 4;
      this.$refs.map.mapObject.setZoom(this.zoom);
    },
    zoomIn() {
      this.zoom = this.zoom + 1 || 10;
      this.$refs.map.mapObject.setZoom(this.zoom);
    },
    changeZoomLevel() {
      this.$refs.map.mapObject.setZoom(this.zoom);
    },
    onReady() {
      this.$refs.markerCluster.mapObject.refreshClusters();
    },
    setZoomLevel() {
      this.zoom = this.$refs.map.mapObject.getZoom();
    },
    mapClick(e) {
      const { lat, lng } = e.latlng;
      const point = turf.point([lng, lat]);
      const arr = [];
      if (this.showLayers.cones === true) {
        this.cones.features.forEach((p) => {
          if (turf.booleanPointInPolygon(point, p)) {
            /* do whatever you want with your clicked polygon */
            arr.push(p.id);
          }
        });
      } else if (this.showLayers.spatial === true) {
        this.spatial.features.forEach((p) => {
          if (turf.booleanPointInPolygon(point, p)) {
            /* do whatever you want with your clicked polygon */
            arr.push(p.id);
          }
        });
      }
      if (arr.length > 1) {
        const popup = L.popup()
          .setLatLng([lat, lng])
          .setContent(`Clicked here: ${lat.toFixed(2)}, ${lng.toFixed(2)}`)
          .openOn(this.$refs.map.mapObject);
        console.log(popup);
      }
      if (arr.length > 0) {
        this.$router.push({
          name: this.fullscreen ? 'Spatial Detail Fullscreen' : 'Spatial Detail',
          query: this.usecase
            ? this.addParamsToQuery({ 'Use Case': this.usecase })
            : this.$route.query,
          params: { id: JSON.stringify(arr) },
        });
      }
    },
    highlightPoly(id, type, color) {
      if (document.getElementsByClassName(`id_${id} ${type}`)[0] !== undefined) {
        this.strokeColor = document.getElementsByClassName(
          `id_${id}`
        )[0].attributes.stroke.nodeValue;
        document.getElementsByClassName(`id_${id} ${type}`)[0].setAttribute('stroke', color);
        document.getElementsByClassName(`id_${id} ${type}`)[0].setAttribute('stroke-width', 3.5);
        document.getElementsByClassName(`id_${id} ${type}`)[0].setAttribute('filter', '');
        let spatCov;
        let layers;
        if (type === 'spatCov') {
          layers = this.$refs.spatCov;
        } else if (type === 'cone') {
          layers = this.$refs.cones;
        }
        if (layers !== undefined) {
          Object.values(layers.mapObject._layers).forEach((i) => {
            const classNames = i.options.className.split(' ');
            if (i.feature.id === id && classNames[classNames.length - 1] === type) {
              spatCov = i;
            }
          });
        }
        if (spatCov !== undefined) {
          spatCov.bringToFront();
        }
        if (this.$refs.origins !== undefined) {
          const origins = this.$refs.origins.mapObject._layers;
          Object.values(origins).forEach((origin) => {
            if (origin.feature.id.includes(id)) {
              origin.openTooltip();
            }
          });
        }
      }
    },
    playdownPoly(id, type) {
      if (document.getElementsByClassName(`id_${id} ${type}`)[0] !== undefined) {
        const filter = document.getElementsByClassName(`id_${id} ${type}`)[0].classList[0];
        document.getElementsByClassName(`id_${id} ${type}`)[0].setAttribute('stroke-width', 0);
        if (filter !== 'blur1') {
          document
            .getElementsByClassName(`id_${id} ${type}`)[0]
            .setAttribute('filter', `url(#${filter})`);
        } else {
          document.getElementsByClassName(`id_${id} ${type}`)[0].setAttribute('stroke-width', 1.5);
          document
            .getElementsByClassName(`id_${id} ${type}`)[0]
            .setAttribute('stroke', this.strokeColor);
        }
        let spatCov;
        let layers;
        if (type === 'spatCov') {
          layers = this.$refs.spatCov;
        } else if (type === 'cone') {
          layers = this.$refs.cones;
        }
        if (layers !== undefined) {
          Object.values(layers.mapObject._layers).forEach((i) => {
            const classNames = i.options.className.split(' ');
            if (i.feature.id === id && classNames[classNames.length - 1] === type) {
              spatCov = i;
            }
          });
        }
        if (spatCov !== undefined) {
          spatCov.bringToBack();
        }
        if (this.$refs.origins !== undefined) {
          const origins = this.$refs.origins.mapObject._layers;
          Object.values(origins).forEach((origin) => {
            if (origin.feature.id.includes(id)) {
              origin.closeTooltip();
            }
          });
        }
      }
    },
    enableSpatCov(id) {
      const spatCovLayer = JSON.parse(JSON.stringify(this.data[0]));
      spatCovLayer.features = [];
      this.data[0].features.forEach((f) => {
        if (id === f.id) {
          spatCovLayer.features.push(f);
        }
      });
      const geojsonStyle = {
        color: '#ff7800',
      };
      console.log(spatCovLayer, 'spatCov');
      this.$refs.map.mapObject.createPane('polygonsPane');
      this.spatCovToAdd = L.geoJSON(spatCovLayer, { pane: 'polygonsPane', style: geojsonStyle });
      this.spatCovToAdd.addTo(this.$refs.map.mapObject);
    },
    disableSpatCov() {
      this.spatCovToAdd.remove();
    },
    filterKingdoms(arr) {
      const filteredKingdoms = [];
      const kingdomNames = [];
      let counter = 1;
      arr.forEach((feature) => {
        if (
          feature.geometry.type === 'MultiPolygon' &&
          !kingdomNames.includes(feature.properties.Name)
        ) {
          kingdomNames.push(feature.properties.Name);
          filteredKingdoms.push(feature);
        }
        if (feature.properties.color === undefined) {
          if (!Object.keys(this.kingdoms).includes(feature.properties.Name)) {
            const hue = counter * 137.508;

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

        // Set deviation attribute of blur
        let blurring = fuzzyness * scale;
        svgBlur.setAttribute('class', 'feGaussianBlur');
        svgBlur.setAttribute('stdDeviation', `${blurring}`);

        // Append blur element to filter element
        svgFilter.appendChild(svgBlur);
        // Append filter element to SVG element
        svg.appendChild(svgFilter);

        let fromZoom;
        this.$refs.map.mapObject.on('zoomend', () => {
          const crs = this.$refs.map.mapObject.options.crs;

          if (fromZoom === undefined) {
            fromZoom = this.$refs.map.mapObject._zoom;
          }

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
      this.$refs.markerCluster.mapObject.addLayer(this.$refs.labels.mapObject);
      this.$refs.map.mapObject.addLayer(this.$refs.markerCluster.mapObject);
    },
    townsToFront() {
      if (
        typeof this.$refs.towns !== 'undefined' &&
        typeof this.$refs.towns.mapObject !== 'undefined'
      ) {
        this.$refs.towns.mapObject.bringToFront();
      }
      if (
        typeof this.$refs.origins !== 'undefined' &&
        typeof this.$refs.origins.mapObject !== 'undefined'
      ) {
        this.$refs.origins.mapObject.bringToFront();
      }
    },
    // foundLocations() {
    //   return this.entries.length && !this.entries.count && this.entries.features.length;
    // },
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

.leaflet-left {
  left: 2%;
}

.v-icon.v-icon.v-icon--link {
  color: white;
}
</style>

<template>
  <div>
    <v-container>
      <v-row :justify="currentView.includes('Detail') ? 'left' : 'center'">
        <v-col cols="12" :lg="currentView.includes('Detail') ? 8 : 12" xl="8">
          <v-row class="grey-bg">
            <v-col>
              <v-autocomplete
                v-model="$store.state.autocomplete.input"
                multiple
                clearable
                item-text="selected_text"
                return-object
                autofocus
                ref="autocomplete"
                :items="$store.state.autocomplete.items"
                :search-input.sync="textInput"
                @change="textInput = ''"
                @keyup.enter="pushQuery"
                :loading="loading"
              >
                <template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.selected_text }}</v-list-item-title>
                    <v-list-item-subtitle>{{ data.item.group }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:selection="data">
                  <v-chip
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      close
                      :color="getChipColorFromGroup(data.item.group)"
                      @click="data.select"
                      @click:close="$store.commit('removeItemFromInput', data.item)"
                    >
                      {{ shorten(data.item.selected_text, 30) }}
                    </v-chip>
                </template>
                <template v-slot:prepend>
                  <v-btn
                    text
                    small
                    @click="pushQuery"
                  >
                    Search
                  </v-btn>
                </template>
                <template v-slot:prepend-inner>
                  <v-skeleton-loader type="chip" v-for="n in skeletonChips" :key="n" />
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row class="grey-bg">
            <template v-if="!$vuetify.breakpoint.mobile">
              <v-col>
                <v-btn text small @dblclick="ee">
                  View as
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  text
                  block
                  small
                  elevation="0"
                  class="view-picker"
                  :disabled="currentView === 'Graph'"
                  :to="{ name: 'Network Graph', query }"
                >
                  Network Graph
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  text
                  block
                  small
                  elevation="0"
                  class="view-picker"
                  :disabled="currentView === 'Map'"
                  :to="{ name: 'Map', query }"
                >
                  Map
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  text
                  block
                  small
                  elevation="0"
                  class="view-picker"
                  :disabled="currentView === 'List'"
                  :to="{ name: 'List', query }"
                >
                  List
                </v-btn>
              </v-col>
            </template>
            <template v-else>
              <v-col>
                <v-select
                  v-model="mobileSelect"
                  :items="['Network Graph', 'Map', 'List']"
                  @change="$router.push({ name: mobileSelect, query });"
                  label="View as"
                />
              </v-col>
            </template>
            <v-col :class="{ 'text-right': !$vuetify.breakpoint.mobile, 'text-center': $vuetify.breakpoint.mobile }">
              <v-btn small text @click="dialog = !dialog">
                <v-icon>mdi-cog</v-icon>
                &nbsp;
                Search Options
              </v-btn>
              <search-option-dialog :active="dialog" />
            </v-col>
          </v-row>
          <v-row align="center" justify="center" v-if="!Object.keys(query).length && !Object.keys($route.params).length">
            <v-col cols="12" md="8">
              <div
                class="text-center no-query"
              >
                <p>
                  Search our database for medieval <b>authors</b>, <b>passages</b>, <b>keywords</b> (such as names of peoples) or <b>case studies</b>.
                </p>
                <p>
                  For instance, try
                  <v-chip @click="$store.commit('addToItemsAndInput', defaultChips.baudovinia)" color="red lighten-3">Baudonivia von Poitiers</v-chip>
                  &#32;
                  <v-chip @click="$store.commit('addToItemsAndInput', defaultChips.barbari)" color="blue lighten-4">barbari</v-chip>
                  or
                  <v-chip @click="$store.commit('addToItemsAndInput', defaultChips.spain)" color="amber lighten-3">Spain and the Bible</v-chip>
                </p>
                <p>
                  Use the <b>slider</b> below to adjust and narrow down the <b>historical</b> scope of your query.
                </p>
              </div>
            </v-col>
          </v-row>
          <v-row v-else>
            <router-view />
          </v-row>
          <v-row>
            <v-col>
              <component
                :disabled="disabledSlider"
                :is="sliderComponent"
                v-model="range"
                class="slider"
                thumb-label="always"
                light
                thumb-size="50"
                track-color="#d5d5d5"
                :track-fill-color="range.length ? '#0f1226' : '#d5d5d5'"
                max="120"
                min="40"
              >
                <template v-slot:thumb-label="{ value }">
                  {{ (value * 10) }} AD
                </template>
                <template v-slot:append>
                  <v-btn icon>
                    <img class="icon" @click="toggleSliderComponent('v-range-slider')" :src="disabledSlider ? $vuetify.icons.values.rangeDisabled : $vuetify.icons.values.range" alt="Range Icon" />
                  </v-btn>
                  <v-btn icon>
                    <img class="icon" @click="toggleSliderComponent('v-slider')" :src="disabledSlider ? $vuetify.icons.values.sliderDisabled : $vuetify.icons.values.slider" alt="Slider Icon" />
                  </v-btn>
                </template>
              </component>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { VRangeSlider, VSlider } from 'vuetify/lib';

import helpers from '@/helpers';
import SearchOptionDialog from './SearchOptionDialog';

export default {
  name: 'Interface',
  data: () => ({
    defaultChips: {
      baudovinia: {
        id: 8,
        text: 'Baudonivia von Poitiers',
        selected_text: 'Baudonivia von Poitiers',
        group: 'Author',
      },
      barbari: {
        id: '33',
        text: 'barbari',
        selected_text: 'barbari, [wurzel: barbar]',
        group: 'Keyword',
      },
      spain: {
        id: '6',
        text: 'Spain and the Bible: Patrick Marschner',
        selected_text: 'Spain and the Bible: Patrick Marschner',
        group: 'Use Case',
      },
    },
    dialog: false,
    disabledSlider: false,
    loading: false,
    range: [40, 120],
    skeletonChips: 0,
    sliderComponent: 'v-range-slider',
    textInput: '',
  }),
  components: {
    VSlider,
    VRangeSlider,
    SearchOptionDialog,
  },
  mixins: [helpers],
  computed: {
    currentView() {
      console.log('currentView', this.$route.name);
      return this.$route.name;
    },
    mobileSelect() {
      return this.currentView === 'Graph' ? 'Network Graph' : this.currentView;
    },
    query() {
      console.log('query changed', this.$route.query);
      return this.$route.query;
    },
  },
  methods: {
    ee() {
      // eslint-disable-next-line no-alert
      alert(':^)');
    },
    getChipColorFromGroup(group) {
      const colors = {
        Author: 'red lighten-3',
        Passage: 'teal lighten-4',
        Keyword: 'blue lighten-4',
        'Use Case': 'amber lighten-3',
        Place: 'green lighten-3',
      };
      return colors[group];
    },
    pushQuery() {
      this.$refs.autocomplete.blur(); // this is the only working solution I found to unfocus autocomplete
      const query = {
        Author: undefined,
        Passage: undefined,
        Keyword: undefined,
        'Use Case': undefined,
      };
      Object.keys(query).forEach((cat) => {
        query[cat] = this.$store.state.autocomplete.input
          .filter((x) => x.group === cat)
          .map((x) => x.id)
          .join('+') || undefined;
      });

      query.time = Array.isArray(this.range) ? this.range.map((x) => x * 10).join('+') : this.range * 10;
      if (query.time === '400+1200') query.time = undefined;

      this.$router.push({
        name: this.currentView,
        query,
      });
    },
    // This function changes the slider from range to point, and creates a new range value fittingly
    toggleSliderComponent(mode) {
      if (mode !== this.sliderComponent) {
        if (Array.isArray(this.range)) this.range = (this.range[0] + this.range[1]) / 2;
        else this.range = [this.range - 10, this.range + 10];
        this.sliderComponent = mode;
      }
    },
  },
  watch: {
    textInput(val) {
      const urls = [
        'https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/autor-autocomplete/?q=',
        'https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/stelle-autocomplete/?q=',
        'https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/keyword-autocomplete/?q=',
        'https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/usecase-autocomplete/?q=',
        'https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/ort-autocomplete/?q=',
      ].map((x) => (x + val));

      const labels = ['Author', 'Passage', 'Keyword', 'Use Case', 'Place'];
      const prefetched = this.$store.state.fetchedResults[urls.toString()];

      if (prefetched) {
        prefetched.forEach((x, i) => {
          this.$store.commit('addItems', { items: x.results, label: labels[i] });
        });
      } else {
        this.loading = true;
        Promise.all(urls.map((x) => fetch(x)))
          .then((res) => {
            Promise.all(res.map((x) => x.json()))
              .then((jsonRes) => {
                console.log('promise all autocomplete', jsonRes);
                this.$store.commit('addToResults', { req: urls.toString(), res: jsonRes });
                jsonRes.forEach((x, i) => {
                  this.$store.commit('addItems', { items: x.results, label: labels[i] });
                });
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                this.loading = false;
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  mounted() {
    console.log('vuetify', this.$vuetify.icons.values.slider);
    console.log('route', this.$route);

    console.log('query', this.query);

    // Add query from url to Autocomplete
    const apiParams = {
      Author: { url: 'autor', text: 'name' },
      Passage: { url: 'stelle', text: 'zitat' },
      Keyword: { url: 'keyword', text: 'stichwort' },
      'Use Case': { url: 'usecase', text: 'title' },
      Place: { url: 'ort', text: 'name' },
    };

    Object.keys(this.query).forEach((cat) => {
      console.log('cat', cat, apiParams[cat]);
      console.log(cat, 'found:', this.query[cat]);

      let ids = this.query[cat].split('+');
      const idCount = ids.length;
      this.skeletonChips += idCount;
      ids = ids.join(',');

      fetch(`https://mmp.acdh-dev.oeaw.ac.at/api/${apiParams[cat].url}/?ids=${ids}`)
        .then((res) => res.json())
        .then((res) => {
          console.log('Query', cat, res);
          res.results.forEach((x) => {
            this.$store.commit('addToItemsAndInput', {
              id: this.getIdFromUrl(x.url),
              text: x[apiParams[cat].text],
              selected_text: x[apiParams[cat].text],
              group: cat,
            });
          });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.skeletonChips -= idCount;
        });
    });
  },
};
</script>

<style>
  div.row a.view-picker.theme--light.v-btn.v-btn--disabled {
    color: rgba(0, 0, 0, .87) !important;
    background-color: #fff !important;
  }
  img.icon {
    height: 100%;
    width: 100%;
  }
  /* makes elements read-only */
  .disable-events {
    pointer-events: none
  }
  .grey-bg {
    background-color: #e8ebf0;
    border-radius: 5px;
    margin-bottom: 10px;;
  }
  .no-query {
    height: 500px;
    font-size: 1.4em;
    color: #666 !important;
  }
  .slider {
    margin-top: 30px;
  }
  .v-slider {
    height: 44px;
  }
  div.v-slider__thumb-label.primary {
    background-color: transparent !important;
    height: 1.2rem !important;
    color: rgba(0, 0, 0, .87) !important;
  }
</style>

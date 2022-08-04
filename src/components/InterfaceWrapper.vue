<template>
  <div>
    <v-container>
      <v-row :justify="currentView.includes('Detail') ? 'start' : 'center'">
        <v-col cols="12" :lg="currentView.includes('Detail') ? 8 : 12" xl="8">
          <v-row class="grey-bg">
            <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 1">
              <v-menu :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn min-height="50px" height="100%" block depressed v-bind="attrs" v-on="on">
                    <v-icon>mdi-cog</v-icon>
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <search-options />
              </v-menu>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 10">
              <v-autocomplete
                v-model="$store.state.autocomplete.input"
                multiple
                clearable
                item-text="selected_text"
                return-object
                no-filter
                autofocus
                auto-select-first
                no-data-text="No data found"
                ref="autocomplete"
                placeholder="Search for Authors, Passages, Keywords, Case Studies or Places"
                :items="filteredSearchedSorted"
                :search-input.sync="textInput"
                @change="textInput = ''"
                @keyup.enter="pushQuery"
                :loading="loading">
                <template v-slot:item="data">
                  <v-list-item-content v-if="data.item.group === 'Keyword' && data.item.selected_text.includes(',')">
                    <v-list-item-title>
                      {{ removeRoot(data.item.selected_text) }}
                      <span v-if="$store.state.completeKeywords.includes(parseInt(data.item.id))">(complete)</span>
                    </v-list-item-title>
                    <v-list-item-subtitle>Keyword ({{ data.item.selected_text.split(',')[1].replace(/\W/g, '') }})
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content v-else>
                    <v-list-item-title>{{ data.item.selected_text }}</v-list-item-title>
                    <v-list-item-subtitle>{{ data.item.group }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:selection="data">
                  <v-chip v-bind="data.attrs" :input-value="data.selected" close
                    :color="getChipColorFromGroup(data.item.group)" @click="data.select"
                    @click:close="$store.commit('removeItemFromInput', data.item)">
                    {{ shorten(data.item.selected_text, 30) }}
                  </v-chip>
                </template>
                <template v-slot:prepend-inner>
                  <v-skeleton-loader type="chip" v-for="n in skeletonChips" :key="n" />
                </template>
              </v-autocomplete>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 1">
              <v-btn min-height="50px" height="100%" x-large block depressed @click="pushQuery">
                <v-icon>mdi-magnify</v-icon>{{ !$vuetify.breakpoint.mobile ? '' : 'Search' }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="grey-bg">
            <template v-if="!$vuetify.breakpoint.mobile">
              <v-col>
                <v-btn text small class="disable-events">
                  View as
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  text
                  block
                  small
                  class="view-picker"
                  :disabled="currentView === 'List'"
                  :to="{ name: 'List', query: addParamsToQuery(getQueryFromInput($store.state.autocomplete.input))}"
                >
                  List
                </v-btn>
              </v-col>
              <v-col>
                <v-btn text block small class="view-picker" :disabled="currentView === 'Graph'"
                  :to="{ name: 'Network Graph Beta', query: addParamsToQuery(query) }">
                  Network Graph
                </v-btn>
              </v-col>
              <v-col>
                <v-btn text block small class="view-picker" :disabled="currentView === 'Map'"
                  :to="{ name: 'Map', query: addParamsToQuery(query) }">
                  Map
                </v-btn>
              </v-col>
              <v-col>
                <v-btn text block small class="view-picker" :disabled="currentView === 'Word Cloud'"
                  :to="{ name: 'Word Cloud', query: addParamsToQuery(query) }">
                  Word Cloud
                </v-btn>
              </v-col>
            </template>
            <template v-else>
              <v-col cols="12">
                <v-select v-model="currentView" :items="['List', 'Network Graph', 'Map', 'Word Cloud']"
                  label="View as" />
              </v-col>
            </template>
            <v-col :class="{ 'text-right': !$vuetify.breakpoint.mobile, 'text-center': $vuetify.breakpoint.mobile }">
              <v-btn text block small class="justify-end" :to="{ name: 'List All', query: addParamsToQuery(query) }">
                &nbsp;
                <v-icon>mdi-format-list-bulleted</v-icon>
                List All Entities
              </v-btn>
            </v-col>
          </v-row>
          <v-row align="center" justify="center"
            v-if="!Object.keys(query).length && !Object.keys($route.params).length">
            <v-col cols="12" md="8">
              <div class="text-center no-query">
                <p>
                  Search our database for medieval <b>authors</b>, <b>passages</b>, <b>keywords</b> (such as names of
                  peoples) or <b>case studies</b>.
                </p>
                <p>
                  For instance, try
                  <v-chip @click="$store.commit('addToItemsAndInput', defaultChips.baudovinia)" color="red lighten-3">
                    Baudonivia von Poitiers</v-chip>
                  &#32;
                  <v-chip @click="$store.commit('addToItemsAndInput', defaultChips.barbari)" color="blue lighten-4">
                    barbari</v-chip>
                  or
                  <v-chip @click="$store.commit('addToItemsAndInput', defaultChips.spain)" color="amber lighten-3">
                    Steppe Peoples 1: "Schwarzes Meer"</v-chip>
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
              <component :disabled="disabledSlider" :is="sliderComponent" v-model="range" class="slider"
                thumb-label="always" light thumb-size="50" track-color="#d5d5d5"
                :track-fill-color="range.length ? '#0f1226' : '#d5d5d5'" max="120" min="40">
                <template v-slot:thumb-label="{ value }">
                  {{ (value * 10) }} AD
                </template>
                <template v-slot:append>
                  <v-menu :close-on-content-click="false">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-cog</v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-text class="text-center">
                        <v-btn icon>
                          <img class="icon" @click="toggleSliderComponent('v-range-slider')"
                            :src="disabledSlider ? $vuetify.icons.values.rangeDisabled : $vuetify.icons.values.range"
                            alt="Range Icon" />
                        </v-btn>
                        <v-btn icon>
                          <img class="icon" @click="toggleSliderComponent('v-slider')"
                            :src="disabledSlider ? $vuetify.icons.values.sliderDisabled : $vuetify.icons.values.slider"
                            alt="Slider Icon" />
                        </v-btn>
                        <v-divider />
                        <v-radio-group label="Timeslider should filter for:" v-model="slideOption">
                          <v-radio label="Passages" color="teal lighten-2" value="passage" />
                          <v-radio label="Texts" color="red darken-4" value="text" />
                        </v-radio-group>
                      </v-card-text>
                    </v-card>
                  </v-menu>
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
/* eslint-disable vue/no-unused-vars */
import { VRangeSlider, VSlider } from 'vuetify/lib';
import Fuse from 'fuse.js';

import helpers from '@/helpers';
import SearchOptions from './SearchOptions';

export default {
  name: 'Interface',
  data: () => ({
    autoQuery: true,
    defaultChips: {
      baudovinia: {
        id: 8,
        text: 'Baudonivia von Poitiers',
        selected_text: 'Baudonivia von Poitiers',
        group: 'Author',
      },
      barbari: {
        id: 33,
        text: 'barbari',
        selected_text: 'barbari',
        group: 'Keyword',
      },
      spain: {
        id: 3,
        text: 'Steppe Peoples 1: "Schwarzes Meer" - Jordanes, Prokop, Zacharias Rhetor',
        selected_text: 'Steppe Peoples 1: "Schwarzes Meer" - Jordanes, Prokop, Zacharias Rhetor',
        group: 'Use Case',
      },
    },
    disabledSlider: false,
    loading: false,
    range: [40, 120],
    skeletonChips: 0,
    sliderComponent: 'v-range-slider',
    textInput: '',
    tooltip: true,
  }),
  components: {
    VSlider,
    VRangeSlider,
    SearchOptions,
  },
  mixins: [helpers],
  computed: {
    filteredSearchedSorted() {
      const { items } = this.$store.state.autocomplete;
      if (!this.textInput) return items;
      // console.log('items', items);
      const keywordSheet = {
        Keyword: 'phrase',
        Name: 'name',
        Region: 'region',
        Ethonym: 'ethnonym',
      };

      const filterArr = items.filter((item) => {
        const storeEq = this.$store.state.searchFilters[item.group.replace(' ', '').toLowerCase()];
        if (typeof storeEq === 'object') {
          if (item.group === 'Keyword' && item.selected_text.includes(',')) {
            if (item.selected_text.includes('Unsicher')) return true;
            return storeEq[keywordSheet[item.selected_text.split(',')[1].replace(/\W/g, '')]];
          }
          return Object.values(storeEq).some((x) => x);
        }
        return storeEq;
      });

      let fuse = new Fuse(filterArr, { keys: ['selected_text'] });
      fuse = fuse.search(this.textInput);
      fuse = fuse.map((res) => res.item);
      // console.log('searched, sorted, filtered', fuse);

      return fuse;
    },
    currentView: {
      get() {
        console.log('currentView', this.$route.name);
        return this.$route.name;
      },
      set(val) {
        this.$router.push({ name: val, query: this.addParamsToQuery(this.query) });
      },
    },
    slideOption: {
      get() {
        return this.$store.state.apiParams.slider;
      },
      set(val) {
        this.$store.commit('setApiParam', { key: 'slider', val });
      },
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
      this.tooltip = false;
      this.autoQuery = false;
      this.$router.push({
        name: this.currentView,
        query: this.getQueryFromInput(this.$store.state.autocomplete.input),
      });
      setTimeout(() => {
        this.autoQuery = true;
      }, 400); // dont judge me
    },
    getQueryFromInput(input) {
      const query = {
        Author: undefined,
        Passage: undefined,
        Keyword: undefined,
        'Use Case': undefined,
        Place: undefined,
      };
      Object.keys(query).forEach((cat) => {
        query[cat] = input
          .filter((x) => x.group === cat)
          .map((x) => x.id)
          .join('+') || undefined;
      });
      query.time = Array.isArray(this.range) ? this.range.map((x) => x * 10).join('+') : this.range * 10;
      if (query.time === '400+1200') query.time = undefined;
      this.autoQuery = false;
      setTimeout(() => {
        this.autoQuery = true;
      }, 400); // dont judge me
      return query;
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
    '$route.query': {
      handler(val) {
        const filteredParams = Object.fromEntries(Object.entries(val)
          .filter((entry) => ['Author', 'Passage', 'Keyword', 'Use Case', 'Place', 'time'].includes(entry[0])));
        if (this.autoQuery) { // you can disable this process
          console.log('route', this.$route);
          console.log('query', filteredParams, val);
          this.$store.commit('clearItems');
          this.$store.commit('clearInput');
          // Add query from url to Autocomplete
          const apiParams = {
            Author: { url: 'autor', text: 'name' },
            Passage: { url: 'stelle', text: 'zitat' },
            Keyword: { url: 'keyword', text: 'stichwort' },
            'Use Case': { url: 'usecase', text: 'title' },
            Place: { url: 'ort', text: 'name' },
          };

          Object.keys(filteredParams).forEach((cat) => {
            if (cat === 'time') {
              this.range = filteredParams[cat].split('+').map((x) => parseInt(x, 10) / 10);
            } else if (filteredParams[cat]) {
              console.log('cat', cat, apiParams[cat]);
              console.log(cat, 'found:', filteredParams[cat]);

              let ids = filteredParams[cat].toString().split('+');
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
                  console.error(err);
                })
                .finally(() => {
                  this.skeletonChips -= idCount;
                });
            }
          });
        }
      },
      deep: true,
      immediate: true,
    },
    textInput(val) {
      if (!val || val.length < 1) return;
      const urls = {};
      const filters = this.$store.state.searchFilters;
      if (filters.author) urls.Author = `https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/autor-autocomplete/?q=${val}`;
      if (filters.passage) urls.Passage = `https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/stelle-autocomplete/?q=${val}`;
      if (Object.values(filters.keyword).some((x) => x)) urls.Keyword = `https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/keyword-autocomplete/?q=${val}`;
      if (filters.usecase) urls['Use Case'] = `https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/usecase-autocomplete/?q=${val}`;
      if (Object.values(filters.place).some((x) => x)) urls.Place = `https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/ort-autocomplete/?q=${val}`;

      const labels = ['Author', 'Passage', 'Keyword', 'Use Case', 'Place'];
      const prefetched = this.$store.state.fetchedResults[JSON.stringify(urls)];

      if (prefetched) {
        prefetched.forEach((x, i) => {
          this.$store.commit('addItems', { items: x.results, label: labels[i] });
        });
      } else {
        this.loading = true;
        Promise.all(Object.values(urls).map((x) => fetch(x)))
          .then((res) => {
            Promise.all(res.map((x) => x.json()))
              .then((jsonRes) => {
                console.log('promise all autocomplete', jsonRes);
                this.$store.commit('addToResults', { req: JSON.stringify(urls), res: jsonRes });
                console.log('urls', urls);
                jsonRes.forEach((x, i) => {
                  this.$store.commit('addItems', { items: x.results, label: Object.keys(urls)[i] });
                });
              })
              .catch((err) => {
                console.error(err);
              })
              .finally(() => {
                this.loading = false;
              });
          })
          .catch((err) => {
            this.loading = false;
            console.error(err);
          });
      }
    },
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
    margin-bottom: 22px;
  }
  .justify-end {
    justify-content: flex-end;
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

<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" xl="8">
          <v-row class="grey-bg">
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
                :to="{ name: 'Graph' }"
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
                :to="{ name: 'Map' }"
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
                :to="{ name: 'List' }"
              >
                List
              </v-btn>
            </v-col>
            <v-spacer />
          </v-row>
          <v-row class="grey-bg">
            <v-col>
              <v-autocomplete
                v-model="input"
                multiple
                item-text="selected_text"
                return-object
                autofocus
                ref="autocomplete"
                :items="items"
                :search-input.sync="textInput"
                @keyup.enter="pushQuery"
                :loading="loading.autocomplete > 0"
              >
                <template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.selected_text"></v-list-item-title>
                    <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:selection="data">
                  <v-chip
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      close
                      :color="getChipColorFromGroup(data.item.group)"
                      @click="data.select"
                      @click:close="remove(data.item)"
                    >
                      {{ data.item.selected_text }}
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
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row align="center" justify="center" v-if="!Object.keys(query).length">
            <v-col cols="12" md="8">
              <div
                class="text-center no-query"
              >
                <p>
                  Search our database for medieval <b>authors</b>, <b>passages</b>, <b>keywords</b> (such as names of peoples) or <b>case studies</b>.
                </p>
                <p>
                  For instance, try
                  <v-chip @click="pushToInputAndItems(defaultChips.baudovinia)" color="red lighten-3">Baudonivia von Poitiers</v-chip>
                  &#32;
                  <v-chip @click="pushToInputAndItems(defaultChips.barbari)" color="blue lighten-4">barbari</v-chip>
                  or
                  <v-chip @click="pushToInputAndItems(defaultChips.spain)" color="amber lighten-3">Spain and the Bible</v-chip>
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
              <v-tooltip top>
                <template v-slot:default="{}">
                  <component
                    disabled
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
                        <img class="icon" @click="toggleSliderComponent('v-range-slider')" :src="$vuetify.icons.values.range" alt="Range Icon" />
                      </v-btn>
                      <v-btn icon>
                        <img class="icon" @click="toggleSliderComponent('v-slider')" :src="$vuetify.icons.values.slider" alt="Slider Icon" />
                      </v-btn>
                    </template>
                  </component>
                </template>
                <span>coming soon!</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { VRangeSlider, VSlider } from 'vuetify/lib';

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
        text: 'barbari, [wurzel: barbar]',
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
    input: [],
    items: [],
    loading: {
      autocomplete: 0,
    },
    range: [47, 113],
    sliderComponent: 'v-range-slider',
    textInput: '',
  }),
  components: {
    VSlider,
    VRangeSlider,
  },
  computed: {
    currentView() {
      console.log('currentView', this.$route.name);
      return this.$route.name;
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
    log(data) {
      console.log('log data', data);
    },
    addResultsToItems(res, label) {
      this.items = this.items.concat(res.map((x) => ({ ...x, group: label })));
    },
    getChipColorFromGroup(group) {
      const colors = {
        Author: 'red lighten-3',
        Passage: 'teal lighten-4',
        Keyword: 'blue lighten-4',
        'Use Case': 'amber lighten-3',
      };
      return colors[group];
    },
    pushToInputAndItems(item) {
      this.items.push(item);
      this.input.push(item);
      // Remove Duplicates
      this.items = [...new Set(this.items)];
      this.input = [...new Set(this.input)];
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
        query[cat] = this.input
          .filter((x) => x.group === cat)
          .map((x) => x.id)
          .join('+') || undefined;
      });
      this.$router.push({
        name: this.$route.name,
        query,
      });
    },
    remove(item) {
      this.input = this.input.filter((x) => !(x.id === item.id && x.group === item.group));
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
      if (!val || val.length <= 2) return; // start looking for autocompletes when there are 2 or more characters entered
      this.items = [];
      // TODO: replace this with Promise.all
      this.loading.autocomplete = 4;
      fetch(`https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/autor-autocomplete/?q=${val}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log('Autor results', res.results);
          this.addResultsToItems(res.results, 'Author');
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading.autocomplete -= 1;
        });

      fetch(`https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/stelle-autocomplete/?q=${val}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log('Autor results', res.results);
          this.addResultsToItems(res.results, 'Passage');
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading.autocomplete -= 1;
        });

      fetch(`https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/keyword-autocomplete/?q=${val}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log('Autor results', res.results);
          this.addResultsToItems(res.results, 'Keyword');
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading.autocomplete -= 1;
        });

      fetch(`https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/usecase-autocomplete/?q=${val}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log('Autor results', res.results);
          this.addResultsToItems(res.results, 'Use Case');
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading.autocomplete -= 1;
        });
    },
  },
  mounted() {
    console.log('vuetify', this.$vuetify.icons.values.slider);
    console.log('route', this.$route);
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
  div.v-slider__thumb-label.primary {
    background-color: transparent !important;
    height: 1.2rem !important;
    color: rgba(0, 0, 0, .87) !important;
  }
</style>

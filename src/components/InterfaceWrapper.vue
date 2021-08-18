<template>
  <div>
    <v-container>
      <v-row justify="center" class="grey-bg">
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
            :item-value="(data) => ({ id: data.id, group: data.group })"
            :items="items"
            :search-input.sync="textInput"
            @keyup.enter="pushQuery"
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
          {{ input }}
        </v-col>
      </v-row>
      <v-row justify="center">
        {{ query }}
        <v-col cols="12" md="8">
          <div v-if="!query" class="text-center no-query">
            <p>
              Search our database for medieval <b>authors</b>, <b>passages</b>, <b>keywords</b> (such as names of peoples) or <b>case studies</b>.
            </p>
            <p>
              For instance, try <v-chip  color="red lighten-3">Baudonivia von Poitiers</v-chip> <v-chip color="blue lighten-4">barbaricus</v-chip> or <v-chip color="amber lighten-3">Spain and the Bible</v-chip>
            </p>
            <p>
              Use the <b>slider</b> below to adjust and narrow down the <b>historical</b> scope of your query.
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="query">
        {{ query }}
        <router-view />
      </v-row>
      <v-row>
        <v-col>
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
    input: '',
    textInput: '',
    items: [],
    range: [47, 113],
    sliderComponent: 'v-range-slider',
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
      return this.$route.query.s;
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
      switch (group) {
        case 'Author':
          return 'red lighten-3';
        case 'Passage':
          return 'teal lighten-4';
        case 'Keyword':
          return 'blue lighten-4';
        case 'Use Case':
          return 'amber lighten-3';
        default:
          return 'grey lighten-4';
      }
    },
    pushQuery() {
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
      fetch(`https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/autor-autocomplete/?q=${val}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log('Autor results', res.results);
          this.addResultsToItems(res.results, 'Author');
        })
        .catch((err) => {
          console.log(err);
        });

      fetch(`https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/stelle-autocomplete/?q=${val}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log('Autor results', res.results);
          this.addResultsToItems(res.results, 'Passage');
        })
        .catch((err) => {
          console.log(err);
        });

      fetch(`https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/keyword-autocomplete/?q=${val}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log('Autor results', res.results);
          this.addResultsToItems(res.results, 'Keyword');
        })
        .catch((err) => {
          console.log(err);
        });

      fetch(`https://mmp.acdh-dev.oeaw.ac.at/archiv-ac/usecase-autocomplete/?q=${val}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log('Autor results', res.results);
          this.addResultsToItems(res.results, 'Use Case');
        })
        .catch((err) => {
          console.log(err);
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

<template>
  <div>
    <v-container>
      <v-row justify="center" class="grey-bg">
        <v-col>
          <v-btn text small @click="ee">
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
            small
            chips
            clearable
            deletable-chips
            multiple
            small-chips
          >
            <template v-slot:prepend>
              <v-btn
                text
                small
              >
                Search
              </v-btn>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <router-view />
      </v-row>
      <v-row>
        <v-col>
          <v-range-slider
            thumb-label="always"
            thumb-color="#0f1226"
            max="48"
            min="16"
          >
            <template v-slot:append>
              <v-btn icon>
                <img class="icon" :src="$vuetify.icons.values.range" alt="Range Icon" />
              </v-btn>
              <v-btn icon>
                <img class="icon" :src="$vuetify.icons.values.slider" alt="Slider Icon" />
              </v-btn>
            </template>
          </v-range-slider>
        </v-col>
      </v-row>
    </v-container>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'Interface',
  data: () => ({
    input: '',
  }),
  computed: {
    currentView() {
      console.log('currentView', this.$route.name);
      return this.$route.name;
    },
  },
  methods: {
    ee() {
      // eslint-disable-next-line no-alert
      alert(':^)');
    },
  },
  mounted() {
    console.log('vuetify', this.$vuetify.icons.values.slider);
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
  .grey-bg {
    background-color: #e8ebf0;
    border-radius: 5px;
    margin-bottom: 10px;;
  }
</style>

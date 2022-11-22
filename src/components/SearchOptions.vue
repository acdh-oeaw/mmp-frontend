<template>
  <v-card class="option-card">
    <v-card-title>Search Options</v-card-title>
    <v-card-subtitle>Change your preferred filters</v-card-subtitle>
    <v-card-text>
      <v-checkbox
        v-model="all.model"
        label="All"
        :indeterminate="all.indeterminate"
        @change="$store.commit('setAllFilters', $event)"
      />
      <v-divider />
      <v-checkbox
        v-model="filters.author"
        label="Author"
        color="red lighten-1"
        @change="changeValue($event, 'author')"
      />
      <v-divider />
      <v-checkbox
        v-model="filters.passage"
        label="Passage"
        color="teal lighten-2"
        @change="changeValue($event, 'passage')"
      />
      <v-divider />
      <v-checkbox
        v-model="keyword.model"
        label="Keyword"
        :indeterminate="keyword.indeterminate"
        color="blue lighten-2"
        @change="changeSubCats($event, 'keyword')"
      />
      <v-checkbox
        v-model="filters.keyword.name"
        label="Name"
        color="blue lighten-2"
        prepend-icon="mdi-chevron-right"
        dense
        @change="changeValue($event, 'keyword.name')"
      />
      <v-checkbox
        v-model="filters.keyword.phrase"
        label="Keyword"
        color="blue lighten-2"
        prepend-icon="mdi-chevron-right"
        dense
        @change="changeValue($event, 'keyword.phrase')"
      />
      <v-checkbox
        v-model="filters.keyword.ethnonym"
        label="Ethnonym"
        color="blue lighten-2"
        prepend-icon="mdi-chevron-right"
        dense
        @change="changeValue($event, 'keyword.ethnonym')"
      />
      <v-checkbox
        v-model="filters.keyword.region"
        label="Region"
        color="blue lighten-2"
        prepend-icon="mdi-chevron-right"
        dense
        @change="changeValue($event, 'keyword.phrase')"
      />
      <v-divider />
      <v-checkbox
        v-model="filters.usecase"
        label="Use Case"
        color="amber lighten-1"
        @change="changeValue($event, 'usecase')"
      />
      <v-divider />
      <v-checkbox
        v-model="filters.place"
        label="Place"
        color="green lighten-1"
        @change="changeValue($event, 'place')"
      />
      <v-divider />
      <v-radio-group v-model="hasUsecase" label="Include Data:">
        <v-radio label="Related to Case Studies" color="teal lighten-2" value="true" />
        <v-radio label="Related to GENS Database" color="teal lighten-2" value="false" />
        <v-radio label="Include everything" color="teal lighten-2" value="don" />
      </v-radio-group>
      <v-divider />
      <v-radio-group v-model="intersection">
        <template #label>
          When using multiple entries, use:
          <v-tooltip right transition="scroll-x-transition">
            <template #activator="{ on, attrs }">
              <v-icon small v-bind="attrs" v-on="on"> mdi-help-circle-outline</v-icon>
            </template>
            Note: this only works for certain entities
          </v-tooltip>
        </template>
        <v-radio color="teal lighten-2" :value="true">
          <template #label>
            <div>
              <div class="theme--light v-labek">Intersection</div>
              <div class="font-weight-regular caption">Show results that contain all inputs</div>
            </div>
          </template>
        </v-radio>
        <v-radio color="teal lighten-2" :value="false">
          <template #label>
            <div>
              <div class="theme--light v-labek">Union</div>
              <div class="font-weight-regular caption">Show all results for all inputs</div>
            </div>
          </template>
        </v-radio>
      </v-radio-group>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'SearchOptionDialog',
  data: () => ({
    all: {
      model: true,
      indeterminate: false,
    },
    keyword: {
      model: true,
      indeterminate: false,
    },
  }),
  computed: {
    filters() {
      return this.$store.state.searchFilters;
    },
    hasUsecase: {
      get() {
        return this.$store.state.apiParams.hasUsecase;
      },
      set(val) {
        this.$store.commit('setApiParam', { key: 'hasUsecase', val });
      },
    },
    intersection: {
      get() {
        return this.$store.state.apiParams.intersect;
      },
      set(val) {
        this.$store.commit('setApiParam', { key: 'intersect', val });
      },
    },
    active: {
      get() {
        return this.$store.state.interface.searchOptions;
      },
      set() {
        this.$store.commit('toggleOptions');
      },
    },
  },
  watch: {
    filters: {
      handler(val) {
        this.handleCategories('keyword', Object.values(this.filters.keyword));

        let allArray = [];
        Object.entries(val).forEach((entry) => {
          if (typeof entry[1] === 'object') allArray = allArray.concat(Object.values(entry[1]));
          else allArray.push(entry[1]);
        });
        this.handleCategories('all', allArray);
      },
      deep: true,
      // immediate: true,
    },
  },
  methods: {
    changeSubCats(val, cat) {
      this.$store.commit('setSubFilters', { cat, val });
    },
    changeValue(val, cat) {
      // console.log(val, cat);
      this.$store.commit('setFilter', { cat, val });
    },
    handleCategories(cat, vals) {
      // console.log('filter vals', vals);
      this[cat].indeterminate = false;
      if (vals.every((x) => x)) this[cat].model = true;
      else if (vals.every((x) => !x)) this[cat].model = false;
      else this[cat].indeterminate = true;
    },
  },
};
</script>

<style scoped>
.option-card {
  max-height: 50vh;
  overflow-y: scroll;
}
</style>

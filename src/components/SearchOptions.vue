<template>
  <v-card class="option-card">
    <v-card-title>Search Options</v-card-title>
    <v-card-subtitle>Change your preferred filters</v-card-subtitle>
    <v-card-text>
      <v-checkbox
        label="All"
        v-model="all.model"
        :indeterminate="all.indeterminate"
        @change="$store.commit('setAllFilters', $event);"
      />
      <v-divider />
      <v-checkbox
        label="Author"
        v-model="filters.author"
        @change="changeValue($event, 'author')"
        color="red lighten-1"
      />
      <v-divider />
      <v-checkbox
        label="Passage"
        v-model="filters.passage"
        @change="changeValue($event, 'passage')"
        color="teal lighten-2"
      />
      <v-divider />
      <v-checkbox
        label="Keyword"
        v-model="keyword.model"
        :indeterminate="keyword.indeterminate"
        @change="changeSubCats($event, 'keyword')"
        color="blue lighten-2"
      />
      <v-checkbox
        label="Name"
        v-model="filters.keyword.name"
        @change="changeValue($event, 'keyword.name')"
        color="blue lighten-2"
        prepend-icon="mdi-chevron-right"
        dense
      />
      <v-checkbox
        label="Keyword"
        v-model="filters.keyword.phrase"
        @change="changeValue($event, 'keyword.phrase')"
        color="blue lighten-2"
        prepend-icon="mdi-chevron-right"
        dense
      />
      <v-checkbox
        label="Ethnonym"
        v-model="filters.keyword.ethnonym"
        @change="changeValue($event, 'keyword.ethnonym')"
        color="blue lighten-2"
        prepend-icon="mdi-chevron-right"
        dense
      />
      <v-checkbox
        label="Region"
        v-model="filters.keyword.region"
        @change="changeValue($event, 'keyword.phrase')"
        color="blue lighten-2"
        prepend-icon="mdi-chevron-right"
        dense
      />
      <v-divider />
      <v-checkbox
        label="Use Case"
        v-model="filters.usecase"
        @change="changeValue($event, 'usecase')"
        color="amber lighten-1"
      />
      <v-divider />
      <v-checkbox
        label="Place"
        v-model="filters.place"
        @change="changeValue($event, 'place')"
        color="green lighten-1"
      />
      <v-divider />
      <v-radio-group
        label="Include Data:"
        v-model="hasUsecase"
      >
        <v-radio
          label="Related to Case Studies"
          color="teal lighten-2"
          value="true"
        />
        <v-radio
          label="Related to GENS Database"
          color="teal lighten-2"
          value="false"
        />
        <v-radio
          label="Include everything"
          color="teal lighten-2"
          value="don"
        />
      </v-radio-group>
      <v-divider />
      <v-radio-group
        label="When using multiple entries, use (if possible):"
        v-model="intersection"
      >
        <v-radio
          label="Intersection"
          color="teal lighten-2"
          :value="true"
        />
        <v-radio
          label="Union"
          color="teal lighten-2"
          :value="false"
        />
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
};
</script>
<style scoped>
  .option-card {
    max-height: 50vh;
    overflow-y: scroll;
  }
</style>

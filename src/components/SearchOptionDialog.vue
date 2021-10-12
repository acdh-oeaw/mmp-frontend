<template>
  <v-dialog
    v-model="active"
    width="600"
  >
    <v-card>
      <v-card-title>Search Options</v-card-title>
      <v-card-subtitle>Change your preferred filters</v-card-subtitle>
      <v-card-text>
        <v-checkbox
          label="All"
          v-model="all"
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
        />
        <v-checkbox
          label="Keyword"
          v-model="filters.keyword.phrase"
          @change="changeValue($event, 'keyword.phrase')"
          color="blue lighten-2"
          prepend-icon="mdi-chevron-right"
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
          v-model="place.model"
          :indeterminate="place.indeterminate"
          @change="changeSubCats($event, 'place')"
          color="green lighten-1"
        />
        <v-checkbox
          label="Related to Text"
          v-model="filters.place.text"
          @change="changeValue($event, 'place.text')"
          color="green lighten-1"
          prepend-icon="mdi-chevron-right"
        />
        <v-checkbox
          label="Related to Passage"
          v-model="filters.place.passage"
          @change="changeValue($event, 'place.passage')"
          color="green lighten-1"
          prepend-icon="mdi-chevron-right"
        />
        <v-checkbox
          label="Related to Author related to Text"
          v-model="filters.place.author"
          @change="changeValue($event, 'place.author')"
          color="green lighten-1"
          prepend-icon="mdi-chevron-right"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SearchOptionDialog',
  props: ['active'],
  data: () => ({
    place: {
      model: true,
      indeterminate: false,
    },
    keyword: {
      model: true,
      indeterminate: false,
    },
  }),
  computed: {
    all: {
      get() {
        return true;
      },
      set(val) {
        this.$store.commit('setAllFilters', val);
      },
    },
    filters() {
      return this.$store.state.searchFilters;
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
    handleCategories(cat) {
      const vals = Object.values(this.filters[cat]);
      console.log('filter vals', vals);
      this[cat].indeterminate = false;
      if (vals.every((x) => x)) {
        this[cat].model = true;
      } else if (vals.every((x) => !x)) {
        this[cat].model = false;
      } else {
        this[cat].indeterminate = true;
      }
    },
  },
  watch: {
    filters: {
      handler() {
        this.handleCategories('keyword');
        this.handleCategories('place');
      },
      deep: true,
      // immediate: true,
    },
  },
};
</script>

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
          dense
        />
        <v-checkbox
          label="Related to Passage"
          v-model="filters.place.passage"
          @change="changeValue($event, 'place.passage')"
          color="green lighten-1"
          prepend-icon="mdi-chevron-right"
          dense
        />
        <v-checkbox
          label="Related to Author related to Text"
          v-model="filters.place.author"
          @change="changeValue($event, 'place.author')"
          color="green lighten-1"
          prepend-icon="mdi-chevron-right"
          dense
        />
        <v-divider />
        <v-radio-group
          v-model="slideOption"
          @change="$store.commit('changeSlider', $event)"
        >
          <template v-slot:label>
            Timeslider should filter for:
          </template>
          <v-radio
            label="Passages"
            color="teal lighten-2"
            value="passage"
          />
          <v-radio
            label="Texts"
            color="red darken-4"
            value="text"
          />
        </v-radio-group>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          text
          @click="$store.commit('toggleOptions')"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SearchOptionDialog',
  data: () => ({
    all: {
      model: true,
      indeterminate: false,
    },
    place: {
      model: true,
      indeterminate: false,
    },
    keyword: {
      model: true,
      indeterminate: false,
    },
    slideOption: 'passage',
  }),
  computed: {
    filters() {
      return this.$store.state.searchFilters;
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
      handler(val) {
        this.handleCategories('keyword', Object.values(this.filters.keyword));
        this.handleCategories('place', Object.values(this.filters.place));

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

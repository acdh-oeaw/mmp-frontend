import Vue from 'vue';
import Vuex from 'vuex';

import helpers from '@/helpers';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    autocomplete: {
      input: [],
      items: [],
    },
    completeKeywords: [47, 77, 78, 82, 83, 129, 130, 152, 153, 157, 159, 171, 172],
    fetchedResults: {},
    interface: {
      searchOptions: false,
      sidebarDrawer: false,
      currentView: 'List',
    },
    searchFilters: {
      author: true,
      passage: true,
      keyword: {
        name: true,
        phrase: true,
        ethnonym: true,
        region: true,
      },
      usecase: true,
      place: true,
    },
    apiParams: {
      hasUsecase: 'true', // theres three options so I cant use true booleans // ok i could but I dont want to and it doesnt matter
      intersect: true,
      slider: 'passage',
    },
  },
  mutations: {
    addItems: (state, { items, label }) => {
      state.autocomplete.items = state.autocomplete.items.concat(
        items.map((x) => ({ ...x, group: label }))
      );
      state.autocomplete.items = helpers.methods.removeDuplicates(state.autocomplete.items, [
        'id',
        'group',
      ]);
    },
    addToItemsAndInput: (state, item) => {
      state.autocomplete.input.push(item);
      state.autocomplete.items.push(item);
      // remove duplicates
      state.autocomplete.input = helpers.methods.removeDuplicates(state.autocomplete.input, [
        'id',
        'group',
      ]);
      state.autocomplete.items = helpers.methods.removeDuplicates(state.autocomplete.items, [
        'id',
        'group',
      ]);
    },
    clearInput: (state) => {
      state.autocomplete.input = [];
    },
    clearItems: (state) => {
      state.autocomplete.items = [];
      console.log('items cleared', state);
    },
    toggleDrawer: (state) => {
      state.interface.sidebarDrawer = !state.interface.sidebarDrawer;
    },
    toggleOptions: (state) => {
      state.interface.searchOptions = !state.interface.searchOptions;
    },
    removeItemFromInput: (state, item) => {
      state.autocomplete.input = state.autocomplete.input.filter(
        (x) => !(x.id === item.id && x.group === item.group)
      );
    },
    setDataView: (state, view) => {
      state.interface.currentView = view;
    },
    // setItems: (state, { items }) => { state.autocomplete.items = items; },
    addToResults: (state, { req, res }) => {
      state.fetchedResults[req] = res;
    },
    // filters:
    setAllFilters: (state, val) => {
      Object.entries(state.searchFilters).forEach((entry) => {
        if (typeof entry[1] === 'object') {
          Object.keys(state.searchFilters[entry[0]]).forEach((key) => {
            state.searchFilters[entry[0]][key] = val;
          });
        } else state.searchFilters[entry[0]] = val;
      });
    },
    setFilter: (state, { cat, val }) => {
      if (cat.includes('.')) {
        const keys = cat.split('.');
        state.searchFilters[keys[0]][keys[1]] = val;
      } else state.searchFilters[cat] = val;
    },
    setSubFilters: (state, { cat, val }) => {
      Object.keys(state.searchFilters[cat]).forEach((key) => {
        state.searchFilters[cat][key] = val;
      });
    },
    setSpecificSubFilter: (state, { cat, key, val }) => {
      state.searchFilters[cat][key] = val;
    },
    setApiParam: (state, { key, val }) => {
      state.apiParams[key] = val;
    },
  },
});

import Vue from 'vue';
import Vuex from 'vuex';

import { isSameItem } from '@/lib/search/is-same-item';
import type { Item } from '@/lib/search/search.types';
import { uniqueItems } from '@/lib/search/unique-items';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    autocomplete: {
      input: [] as Array<Item>,
    },
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
      slider: 'text',
    },
    graphOptions: {
      showNeighborsOnly: true,
    },
  },
  mutations: {
    addAutoCompleteSelectedValues(state, values) {
      state.autocomplete.input = uniqueItems(state.autocomplete.input, values);
    },
    removeAutoCompleteSelectedValue(state, item) {
      state.autocomplete.input = state.autocomplete.input.filter((i) => !isSameItem(item, i));
    },
    clearAutoCompleteSelectedValues(state) {
      state.autocomplete.input = [];
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
    setGraphParam: (state, { key, val }) => {
      state.graphOptions[key] = val;
    },
  },
});

export type Store = typeof store;

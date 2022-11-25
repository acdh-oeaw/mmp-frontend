import Vue from 'vue';
import Vuex from 'vuex';

import type { ResourceKind } from '@/api';
import { isSameItem } from '@/lib/search/is-same-item';
import type { Item } from '@/lib/search/types';
import { uniqueItems } from '@/lib/search/unique-items';

Vue.use(Vuex);

export type Store = typeof store;

export const store = new Vuex.Store({
  state: {
    autocomplete: {
      input: [] as Array<Item>,
    },
    fetchedResults: {},
    interface: {
      sidebarDrawer: false,
      currentView: 'List',
    },
    search: {
      kinds: ['autor', 'keyword', 'ort', 'stelle', 'usecase'] as Array<ResourceKind>,
    },
  },
  mutations: {
    setSearchKinds(state, values) {
      state.search.kinds = values;
    },
    addAutoCompleteSelectedValues(state, values) {
      state.autocomplete.input = uniqueItems(state.autocomplete.input, values);
    },
    removeAutoCompleteSelectedValue(state, item) {
      state.autocomplete.input = state.autocomplete.input.filter((i) => !isSameItem(item, i));
    },
    clearAutoCompleteSelectedValues(state) {
      state.autocomplete.input = [];
    },
    toggleDrawer(state) {
      state.interface.sidebarDrawer = !state.interface.sidebarDrawer;
    },
    setDataView(state, view) {
      state.interface.currentView = view;
    },
  },
});

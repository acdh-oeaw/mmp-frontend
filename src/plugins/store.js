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
    fetchedResults: {},
    interface: {
      sidebarDrawer: false,
      currentView: 'Network Graph',
    },
  },
  mutations: {
    addItems: (state, { items, label }) => {
      state.autocomplete.items = state.autocomplete.items.concat(items.map((x) => ({ ...x, group: label })));
      state.autocomplete.items = helpers.methods.removeDuplicates(state.autocomplete.items, ['id', 'group']);
    },
    addToItemsAndInput: (state, item) => {
      state.autocomplete.input.push(item);
      state.autocomplete.items.push(item);
      // remove duplicates
      state.autocomplete.input = helpers.methods.removeDuplicates(state.autocomplete.input, ['id', 'group']);
      state.autocomplete.items = helpers.methods.removeDuplicates(state.autocomplete.items, ['id', 'group']);
    },
    clearInput: (state) => { state.autocomplete.input = []; },
    clearItems: (state) => {
      state.autocomplete.items = [];
      console.log('items cleared', state);
    },
    toggleDrawer: (state) => { state.interface.sidebarDrawer = !state.interface.sidebarDrawer; },
    removeItemFromInput: (state, item) => { state.autocomplete.input = state.autocomplete.input.filter((x) => !(x.id === item.id && x.group === item.group)); },
    setDataView: (state, view) => { state.interface.currentView = view; },
    // setItems: (state, { items }) => { state.autocomplete.items = items; },
    addToResults: (state, { req, res }) => { state.fetchedResults[req] = res; },
  },
  actions: {},
  modules: {},
});

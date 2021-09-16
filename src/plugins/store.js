import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

function removeDuplicates(arr) {
  return arr.filter((item, index, self) => index === self.findIndex((t) => (
    t.id === item.id && t.group === item.group
  )));
}

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
      state.autocomplete.items = removeDuplicates(state.autocomplete.items);
    },
    addToItemsAndInput: (state, item) => {
      state.autocomplete.input.push(item);
      state.autocomplete.items.push(item);
      // remove duplicates
      state.autocomplete.input = removeDuplicates(state.autocomplete.input);
      state.autocomplete.items = removeDuplicates(state.autocomplete.items);
    },
    clearInput: (state) => { state.autocomplete.input = []; },
    clearItems: (state) => { state.autocomplete.items = []; },
    toggleDrawer: (state) => { state.interface.sidebarDrawer = !state.interface.sidebarDrawer; },
    removeItemFromInput: (state, item) => { state.autocomplete.input = state.autocomplete.input.filter((x) => !(x.id === item.id && x.group === item.group)); },
    setDataView: (state, view) => { state.interface.currentView = view; },
    // setItems: (state, { items }) => { state.autocomplete.items = items; },
    addToResults: (state, { req, res }) => { state.fetchedResults[req] = res; },
  },
  actions: {
  },
  modules: {
  },
});

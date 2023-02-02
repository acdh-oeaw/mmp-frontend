import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    interface: {
      currentView: 'List',
    },
    graphOptions: {
      showNeighborsOnly: true,
    },
  },
  mutations: {
    setDataView: (state, view) => {
      state.interface.currentView = view;
    },
    setGraphParam: (state, { key, value }: { key: 'showNeighborsOnly'; value: boolean }) => {
      state.graphOptions[key] = value;
    },
  },
});

export type Store = typeof store;

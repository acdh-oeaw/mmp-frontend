import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    interface: {
      sidebarDrawer: false,
      currentView: 'Graph',
    },
  },
  mutations: {
    toggleDrawer: (state) => { state.interface.sidebarDrawer = !state.interface.sidebarDrawer; },
    setDataView: (state, view) => { state.interface.currentView = view; },
  },
  actions: {
  },
  modules: {
  },
});

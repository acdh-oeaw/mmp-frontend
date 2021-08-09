import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    interface: {
      sidebarDrawer: false,
    },
  },
  mutations: {
    toggleDrawer: (state) => { state.interface.sidebarDrawer = !state.interface.sidebarDrawer; },
  },
  actions: {
  },
  modules: {
  },
});

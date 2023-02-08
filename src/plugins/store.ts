import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		graphOptions: {
			showNeighborsOnly: true,
		},
	},
	mutations: {
		setGraphParam: (state, { key, value }: { key: 'showNeighborsOnly'; value: boolean }) => {
			state.graphOptions[key] = value;
		},
	},
});

export type Store = typeof store;

import { defineStore } from "pinia";

export const useNetworkGraphStore = defineStore("network-graph", {
	state() {
		return {
			showNeighborsOnly: true,
		};
	},
});

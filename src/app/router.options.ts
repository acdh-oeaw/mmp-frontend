import { type RouterConfig } from "@nuxt/schema";

const options: RouterConfig = {
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) return savedPosition;

		if (to.hash) return { el: to.hash };

		/** Avoid scrolling to top when sidepanel is toggled, i.e. when `selection` search param changes. */
		if ("selection" in to.query || "selection" in from.query) return undefined;

		return { top: 0, left: 0 };
	},
};

export default options;

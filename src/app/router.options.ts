import { type RouterConfig } from "@nuxt/schema";

const options: RouterConfig = {
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) return savedPosition;

		if (to.hash) return { el: to.hash };

		// FIXME: Avoid scrolling to top when sidepanel opens, i.e. when only `selection` search param changes.
		// Can we pass `meta` via `NuxtLink`?

		return { top: 0, left: 0 };
	},
};

export default options;

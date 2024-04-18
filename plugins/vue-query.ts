import {
	dehydrate,
	type DehydratedState,
	hydrate,
	QueryClient,
	VueQueryPlugin,
	type VueQueryPluginOptions,
} from "@tanstack/vue-query";

import { defineNuxtPlugin, useState } from "#imports";

/**
 * @see https://tanstack.com/query/v4/docs/vue/guides/ssr
 */
export default defineNuxtPlugin((nuxtApp) => {
	const vueQueryState = useState<DehydratedState | null>("vue-query");

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				/** Unused queries will be garbage-collected after 45 minutes. */
				cacheTime: 45 * 60 * 1000,
				keepPreviousData: true,
				refetchOnMount: false,
				refetchOnReconnect: false,
				refetchOnWindowFocus: false,
				/** Queries used on a page will never go stale. */
				staleTime: Infinity,
			},
		},
	});

	const options: VueQueryPluginOptions = { queryClient };

	nuxtApp.vueApp.use(VueQueryPlugin, options);

	if (process.server) {
		nuxtApp.hooks.hook("app:rendered", () => {
			vueQueryState.value = dehydrate(queryClient);
		});
	}

	if (process.client) {
		nuxtApp.hooks.hook("app:created", () => {
			hydrate(queryClient, vueQueryState.value);
		});
	}
});

import {
	type DehydratedState,
	type VueQueryPluginOptions,
	dehydrate,
	hydrate,
	keepPreviousData,
	QueryClient,
	VueQueryPlugin,
} from "@tanstack/vue-query";

import { defineNuxtPlugin, useState } from "#imports";

/**
 * @see https://tanstack.com/query/latest/docs/framework/vue/guides/ssr
 */
export default defineNuxtPlugin((nuxtApp) => {
	const vueQueryState = useState<DehydratedState | null>("vue-query");

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				/** Unused queries will be garbage-collected after 45 minutes. */
				gcTime: 45 * 60 * 1000,
				placeholderData: keepPreviousData,
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

	if (import.meta.server) {
		nuxtApp.hooks.hook("app:rendered", () => {
			vueQueryState.value = dehydrate(queryClient);
		});
	}

	if (import.meta.client) {
		nuxtApp.hooks.hook("app:created", () => {
			if (vueQueryState.value != null) hydrate(queryClient, vueQueryState.value);
		});
	}
});

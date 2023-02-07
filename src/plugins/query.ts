import type { VueQueryPluginOptions } from '@tanstack/vue-query';
import { VueQueryPlugin } from '@tanstack/vue-query';

const queryOptions: VueQueryPluginOptions = {
	queryClientConfig: {
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
	},
};

export { VueQueryPlugin as query, queryOptions };

import '@fontsource/roboto-flex/variable-full.css';
import '@mdi/font/css/materialdesignicons.css';

import type { VueQueryPluginOptions } from '@tanstack/vue-query';
import { VueQueryPlugin } from '@tanstack/vue-query';
import Vue from 'vue';

import App from '@/App.vue';
import router from '@/plugins/router';
import store from '@/plugins/store';
import vuetify from '@/plugins/vuetify';

Vue.config.productionTip = false;

const queryOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        /** Unused queries will be garbage-collected after 15 minutes. */
        cacheTime: 15 * 60 * 1000,
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

Vue.use(VueQueryPlugin, queryOptions);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

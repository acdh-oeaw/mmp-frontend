import '@fontsource/roboto-flex/variable-full.css';
import '@mdi/font/css/materialdesignicons.css';

import Vue from 'vue';

import App from '@/App.vue';
import { query, queryOptions } from '@/lib/query';
import { router } from '@/plugins/router';
import { store } from '@/plugins/store';
import { vuetify } from '@/plugins/vuetify';

Vue.config.productionTip = false;

Vue.use(query, queryOptions);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

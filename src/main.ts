import '@fontsource/roboto-flex/variable-full.css';
import '@mdi/font/css/materialdesignicons.css';
import '@/styles/global.css';

import Vue from 'vue';

import App from '@/app.vue';
import { query, queryOptions } from '@/plugins/query';
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

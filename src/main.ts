import '@fontsource/roboto-flex/variable-full.css';
import '@mdi/font/css/materialdesignicons.css';
import '@/styles/index.css';

import { createPinia, PiniaVuePlugin } from 'pinia';
import Vue from 'vue';

import App from '@/app.vue';
import { query, queryOptions } from '@/plugins/query';
import { router } from '@/plugins/router';
import { vuetify } from '@/plugins/vuetify';

Vue.config.productionTip = false;

Vue.use(PiniaVuePlugin);
Vue.use(query, queryOptions);

const pinia = createPinia();

new Vue({
	router,
	pinia,
	vuetify,
	render: (h) => h(App),
}).$mount('#app');

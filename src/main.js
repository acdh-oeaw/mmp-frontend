import Vue from 'vue';
import App from './App';
import router from './plugins/router';
import store from './plugins/store';
import vuetify from './plugins/vuetify';
import i18n from './plugins/i18n';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');

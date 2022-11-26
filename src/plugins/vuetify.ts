import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#0f1226',
      },
    },
  },
  icons: {
    iconfont: 'mdi',
  },
});
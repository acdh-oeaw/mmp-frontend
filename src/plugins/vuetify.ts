import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import customRange from '@/assets/custom_range_icon.svg';
import customRangeDisabled from '@/assets/custom_range_icon_disabled.svg';
import customSlider from '@/assets/custom_slider_icon.svg';
import customSliderDisabled from '@/assets/custom_slider_icon_disabled.svg';

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
    values: {
      slider: customSlider,
      range: customRange,
      sliderDisabled: customSliderDisabled,
      rangeDisabled: customRangeDisabled,
    },
  },
});

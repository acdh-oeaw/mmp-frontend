import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

import customSlider from '@/assets/custom_slider_icon.svg';
import customRange from '@/assets/custom_range_icon.svg';
import customSliderDisabled from '@/assets/custom_slider_icon_disabled.svg';
import customRangeDisabled from '@/assets/custom_range_icon_disabled.svg';

Vue.use(Vuetify);

const vuetify = new Vuetify({
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

export default vuetify;

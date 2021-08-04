module.exports = {
  publicPath: '/mmp/',

  transpileDependencies: [
    'vuetify',
  ],

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'de',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },
};

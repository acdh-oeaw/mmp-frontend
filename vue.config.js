module.exports = {
  publicPath: '/mmp-frontend/',

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
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.geojson$/,
          loader: 'json-loader',
        },
      ],
    },
  },
};

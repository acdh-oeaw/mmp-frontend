import { defineConfig } from '@vue/cli-service';

import { metadata } from './config/metadata.config.mjs';

const publicPath = '/mmp-frontend/';
const canonicalUrl = new URL(
  publicPath,
  process.env['VUE_APP_BASE_URL'] ?? 'https://acdh-oeaw.github.io'
).toString();

const config = defineConfig({
  chainWebpack(config) {
    /**
     * @see https://github.com/vuejs/vue-cli/issues/3123
     */
    config.resolve.alias.set('~', process.cwd());

    config.plugin('html').tap((args) => {
      args[0].title = metadata.title;
      args[0].meta = {
        description: metadata.description,
        'og:type': 'website',
        'og:locale': 'en',
        'og:title': metadata.title,
        'og:description': metadata.description,
        'og:url': canonicalUrl,
      };
      args[0].templateParameters = {
        canonicalUrl,
      };
      return args;
    });
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
  productionSourceMap: false,
  publicPath,
  transpileDependencies: true,
});

export default config;

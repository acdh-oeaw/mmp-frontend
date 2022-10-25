import { defineConfig } from '@vue/cli-service';

const config = defineConfig({
  chainWebpack(config) {
    /**
     * @see https://github.com/vuejs/vue-cli/issues/3123
     */
    config.resolve.alias.set('~', process.cwd());
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
  publicPath: '/mmp-frontend/',
  transpileDependencies: true,
});

export default config;

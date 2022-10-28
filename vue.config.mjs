import { defineConfig } from '@vue/cli-service';

const config = defineConfig({
  chainWebpack(config) {
    /**
     * @see https://github.com/vuejs/vue-cli/issues/3123
     */
    config.resolve.alias.set('~', process.cwd());
  },
  productionSourceMap: false,
  publicPath: '/mmp-frontend/',
  transpileDependencies: true,
});

export default config;

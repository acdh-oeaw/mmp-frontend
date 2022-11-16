import { fileURLToPath, URL } from 'node:url';

import vue2 from '@vitejs/plugin-vue2';
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import type { Plugin } from 'vite';
import { defineConfig, loadEnv } from 'vite';

import { metadata } from './config/metadata.config';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const env = loadEnv(process.env['NODE_ENV']!, process.cwd());

const publicPath = '/mmp-frontend/';
const canonicalUrl = new URL(publicPath, env['VITE_APP_BASE_URL']).toString();

/**
 * Plugin to add `<title>` and `<meta>` to `index.html`.
 */
function meta(): Plugin {
  return {
    name: 'meta',
    transformIndexHtml(html) {
      return {
        html: html.replace(/<html lang="(.*?)">/, `<html lang="${metadata.locale}">`),
        tags: [
          { tag: 'title', children: metadata.title, injectTo: 'head' },
          {
            tag: 'link',
            attrs: { href: '/favicon.ico', rel: 'icon', sizes: 'any' },
            injectTo: 'head',
          },
          {
            tag: 'link',
            attrs: { href: '/apple-touch-icon.png', rel: 'apple-touch-icon' },
            injectTo: 'head',
          },
          { tag: 'link', attrs: { href: '/app.webmanifest', rel: 'manifest' }, injectTo: 'head' },
          {
            tag: 'meta',
            attrs: { name: 'description', content: metadata.description },
            injectTo: 'head',
          },
          { tag: 'link', attrs: { rel: 'canonical', href: canonicalUrl }, injectTo: 'head' },

          { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: canonicalUrl }, injectTo: 'head' },
          {
            tag: 'meta',
            attrs: { property: 'og:title', content: metadata.title },
            injectTo: 'head',
          },
          {
            tag: 'meta',
            attrs: { property: 'og:description', content: metadata.description },
            injectTo: 'head',
          },
          {
            tag: 'meta',
            attrs: { property: 'og:image', content: '/image.webp' },
            injectTo: 'head',
          },
          {
            tag: 'meta',
            attrs: { property: 'og:locale', content: metadata.locale },
            injectTo: 'head',
          },
        ],
      };
    },
  };
}

export default defineConfig({
  base: publicPath,
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('vuetify/lib')) {
            return 'vuetify';
          }
          if (id.includes('@mdi/font/css/materialdesignicons.css')) {
            return 'materialdesignicons';
          }
          if (id.includes('/assets/geojson/')) {
            return 'geojson';
          }
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: ['@import "@/scss/variables.scss"', ''].join('\n'),
      },
    },
  },
  plugins: [
    vue2(),
    meta(),
    Components({
      dts: false,
      directives: false,
      resolvers: [VuetifyResolver()],
      types: [
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView'],
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('.', import.meta.url)),
    },
    /**
     * TODO: remove, and import all vue files with extension
     * @see https://vitejs.dev/config/shared-options.html#resolve-extensions
     */
    extensions: ['.mjs', '.js', '.ts', '.json', '.vue'],
  },
});

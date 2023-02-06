import { fileURLToPath, URL } from 'node:url';

import vue2 from '@vitejs/plugin-vue2';
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import type { Plugin } from 'vite';
import { defineConfig, loadEnv } from 'vite';

import { manifestFileName, metadata, openGraphImageName } from './config/metadata.config';
import { createAnalyticsScript } from './src/lib/matomo-analytics';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const env = loadEnv(process.env['NODE_ENV']!, process.cwd());

const canonicalUrl = env['VITE_APP_BASE_URL'];
const title = [metadata.shortTitle, metadata.title].join(' - ');

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
          { tag: 'title', children: title, injectTo: 'head' },
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
          {
            tag: 'link',
            attrs: { href: '/' + manifestFileName, rel: 'manifest' },
            injectTo: 'head',
          },
          {
            tag: 'meta',
            attrs: { name: 'description', content: metadata.description },
            injectTo: 'head',
          },
          { tag: 'link', attrs: { rel: 'canonical', href: canonicalUrl }, injectTo: 'head' },

          { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: canonicalUrl }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:title', content: title }, injectTo: 'head' },
          {
            tag: 'meta',
            attrs: { property: 'og:description', content: metadata.description },
            injectTo: 'head',
          },
          {
            tag: 'meta',
            attrs: { property: 'og:image', content: '/' + openGraphImageName },
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

/**
 * Add Matomo analytics script.
 */
function matomoAnalytics(): Plugin | undefined {
  const baseUrl = env['VITE_APP_MATOMO_BASE_URL'];
  const id = env['VITE_APP_MATOMO_ID'];

  if (baseUrl == null || id == null) return;

  return {
    name: 'matomoAnalytics',
    transformIndexHtml(html, ctx) {
      /** Only add in production build. */
      if (ctx.bundle == null) return;

      return [
        {
          tag: 'script',
          attrs: { defer: true },
          children: createAnalyticsScript(baseUrl, id),
          injectTo: 'body',
        },
      ];
    },
  };
}

export default defineConfig({
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
          return undefined;
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: ['@import "@/styles/vuetify.scss"', ''].join('\n'),
      },
    },
  },
  plugins: [
    vue2(),
    meta(),
    matomoAnalytics(),
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
  },
  server: {
    port: 3000,
  },
});

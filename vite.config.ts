import { fileURLToPath, URL } from 'node:url';

import vue2 from '@vitejs/plugin-vue2';
import { defineConfig } from 'vite';

const publicPath = '/mmp-frontend/';

export default defineConfig({
  base: publicPath,
  plugins: [vue2()],
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

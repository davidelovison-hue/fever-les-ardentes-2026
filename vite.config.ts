import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function ghPagesSpa404(): import('vite').Plugin {
  return {
    name: 'gh-pages-spa-404',
    closeBundle() {
      copyFileSync(resolve(__dirname, 'dist/index.html'), resolve(__dirname, 'dist/404.html'));
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'production' ? [ghPagesSpa404()] : [])],
  base: mode === 'production' ? '/fever-les-ardentes-2026/' : '/',
  server: { port: 5173 },
}));

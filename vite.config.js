import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  cacheDir: 'node_modules/.vite',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          if (id.includes('lucide-react')) {
            return 'icons';
          }

          // Keep React + motion libs together to avoid vendor <-> react-vendor cycles.
          if (
            id.includes('react-dom') ||
            id.includes('/react/') ||
            id.includes('scheduler') ||
            id.includes('framer-motion') ||
            id.includes('gsap')
          ) {
            return 'react-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
  server: {
    fs: {
      strict: true,
      allow: [projectRoot],
    },
  },
});

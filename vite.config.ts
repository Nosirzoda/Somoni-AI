import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // visualizer will generate dist/stats.html with gzip sizes
    visualizer({ filename: 'dist/stats.html', open: false, gzipSize: true }),
  ],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'vendor_firebase';
            if (id.includes('@google/genai')) return 'vendor_genai';
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});

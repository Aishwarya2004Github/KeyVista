import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        secure: false,
      },
    },
  },
  
  plugins: [react()],

  build: {
    chunkSizeWarningLimit: 1000, // Set the limit in kilobytes (e.g., 1000 KB = 1 MB)
  },
  css: {
    postcss: {
      config: path.resolve(__dirname, 'postcss.config.js'), // Ensure this path is correct
    },
  },
});

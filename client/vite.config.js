import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer, // Autoprefixer for CSS
        tailwindcss,   // Tailwind CSS as a PostCSS plugin
      ],
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Set the limit in kilobytes (1 MB)
  },
  plugins: [react()], // React plugin
});

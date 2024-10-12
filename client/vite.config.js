import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from 'tailwindcss'; // Import Tailwind CSS
import autoprefixer from 'autoprefixer'; // Import Autoprefixer

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
      plugins: [
        tailwindcss(), // Use Tailwind CSS
        autoprefixer(), // Use Autoprefixer
      ],
    },
  },
});

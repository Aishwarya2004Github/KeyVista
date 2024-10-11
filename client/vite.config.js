import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://keyvista.onrender.com',
        secure: false,
      },
    },
  },
  
  plugins: [react()],

  build: {
    chunkSizeWarningLimit: 1000, // Set the limit in kilobytes (e.g., 1000 KB = 1 MB)
  },
});

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Set the root folder where your index.html lives
  root: 'public',

  build: {
    // Output built files to /dist
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,

    // Optional: base path for serving
    // base: './'
  },

  server: {
    port: 5173, // Local dev port (optional)
    open: true  // Auto-open in browser
  }
});

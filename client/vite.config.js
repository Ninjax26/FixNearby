import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react', 'react-icons', 'react-hot-toast'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          map: ['rc-slider'],
        },
      },
    },
    chunkSizeWarningLimit: 300,
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
  },
  server: {
    port: 5173,
    strictPort: false,
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/kaizen-academy-sensei/',
  server: {
    port: 3001,
    open: true
  },
  optimizeDeps: {
    exclude: ['chromadb', 'openai']
  },
  build: {
    rollupOptions: {
      external: ['chromadb', 'openai']
    }
  }
})

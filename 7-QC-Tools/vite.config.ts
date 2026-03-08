import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  base: './',
  server: {
    port: 3001
  },
  optimizeDeps: {
    exclude: ['playwright', 'playwright-core'],
    include: []
  },
  define: {
    global: 'globalThis'
  },
  ssr: {
    noExternal: ['playwright-core']
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['playwright-core']
    }
  }
})

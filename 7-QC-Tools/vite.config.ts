import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  base: '/7-QC-Tools/',
  server: {
    port: 3001
  },
  optimizeDeps: {
    exclude: ['playwright', 'playwright-core'],
    include: []
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['playwright-core']
    }
  }
})

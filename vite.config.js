import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (
            id.includes('react-dom') ||
            id.includes('react-router') ||
            /[/\\]node_modules[/\\]react[/\\]/.test(id)
          ) {
            return 'react-vendor'
          }
          if (id.includes('gsap')) return 'gsap'
          if (id.includes('motion')) return 'motion'
          return undefined
        },
      },
    },
  },
})

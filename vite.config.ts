import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/snubugo/',  // GitHub 저장소명에 맞게 수정
  assetsInclude: ['**/*.pdf'],
  server: {
    fs: {
      allow: ['..']
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          pdf: ['react-pdf', 'pdfjs-dist']
        }
      }
    }
  }
})
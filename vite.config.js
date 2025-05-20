import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',         // Ensure Vite finds index.html at root
  build: {
    outDir: 'dist'
  }
})

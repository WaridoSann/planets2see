import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/planets2see/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: { output: { manualChunks: { three: ['three'], react: ['react', 'react-dom'], effects: ['@react-three/postprocessing'] } } },
  },
})

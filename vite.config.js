import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/ATP-Final-24EG105H11/',
  plugins: [react(),tailwindcss()],
})

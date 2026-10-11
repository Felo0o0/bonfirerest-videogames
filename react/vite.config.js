import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' genera rutas relativas en el build, así el sitio
// funciona también al publicarlo en GitHub Pages (subcarpeta).
export default defineConfig({
  plugins: [react()],
  base: './',
})

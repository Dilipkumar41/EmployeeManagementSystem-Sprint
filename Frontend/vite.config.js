// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // optional: change the dev port if you like
    // port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7061',
        changeOrigin: true,
        secure: false,        // allow self-signed HTTPS (Kestrel dev cert)
        // If your backend does NOT include '/api' in its path, uncomment below to strip it:
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})

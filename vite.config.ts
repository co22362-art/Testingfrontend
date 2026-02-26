import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // ------------------------------------------------------------
  // PROXY: Routes API calls from the central UI (port 5174)
  // to the correct backend service, avoiding CORS issues.
  // Auth cookies (sb_access, sb_refresh) are forwarded correctly.
  // ------------------------------------------------------------
  server: {
    proxy: {
      // Auth service (port 3000): signin, signout, me, refresh, passwords
      '/api/signin': { target: 'http://localhost:3000', changeOrigin: true },
      '/api/signout': { target: 'http://localhost:3000', changeOrigin: true },
      '/api/me': { target: 'http://localhost:3000', changeOrigin: true },
      '/api/refresh': { target: 'http://localhost:3000', changeOrigin: true },
      '/api/change-password': { target: 'http://localhost:3000', changeOrigin: true },
      '/api/request-password-reset': { target: 'http://localhost:3000', changeOrigin: true },
      '/api/reset-password': { target: 'http://localhost:3000', changeOrigin: true },

      // People service (port 3012): employees, companies
      '/api/employees': { target: 'http://localhost:3012', changeOrigin: true },
      '/api/companies': { target: 'http://localhost:3012', changeOrigin: true },

      // Daily Wins service (port 3010)
      '/api/daily-wins': { target: 'http://localhost:3010', changeOrigin: true },
    }
  }
})

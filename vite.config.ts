import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // ── OUR ADDITION: Proxy API calls to backend services ──────────
  // Vite forwards /api/* to the correct backend port server-side.
  // This avoids CORS issues and allows HttpOnly cookies to flow.
  server: {
    proxy: {
      '/api/signin': { target: 'http://localhost:3000', changeOrigin: true },
      '/api/signout': { target: 'http://localhost:3000', changeOrigin: true },
      '/api/me': { target: 'http://localhost:3000', changeOrigin: true },
      '/api/employees': { target: 'http://localhost:3012', changeOrigin: true },
      '/api/daily-wins': { target: 'http://localhost:3010', changeOrigin: true },
    }
  }
})

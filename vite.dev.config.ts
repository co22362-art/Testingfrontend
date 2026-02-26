import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * OUR INDESTRUCTIBLE VITE CONFIGURATION
 * ─────────────────────────────────────────────────────────
 * Figma Make constantly overwrites vite.config.ts when it pushes.
 * So we run our dev server using this file instead!
 * 
 * Run using: vite --config vite.dev.config.ts
 */
export default defineConfig({
    plugins: [react(), tailwindcss()],
    assetsInclude: ['**/*.svg', '**/*.csv'],

    server: {
        proxy: {
            '/api/signin': { target: 'http://localhost:3000', changeOrigin: true },
            '/api/signout': { target: 'http://localhost:3000', changeOrigin: true },
            '/api/me': { target: 'http://localhost:3000', changeOrigin: true },
            '/api/employees': { target: 'http://localhost:3012', changeOrigin: true },
            '/api/daily-wins': { target: 'http://localhost:3010', changeOrigin: true },
        }
    },

    resolve: {
        alias: [
            { find: '@', replacement: path.resolve(__dirname, './src') },
            // HIJACK FIGMA'S ENTRYPOINT:
            // When Vite's index.html asks for "src/main.tsx" (Figma's untouched file),
            // Vite will secretly serve "src/connected/main.tsx" (Our indestructible file)
            { find: '/src/main.tsx', replacement: path.resolve(__dirname, './src/connected/main.tsx') }
        ]
    }
});

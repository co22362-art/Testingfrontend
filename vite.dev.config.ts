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
 *
 * PROXY MAP (path → backend server):
 *   /api/signin, /api/signout, /api/me, /api/refresh  → :3000 (pa_3000_user_login)
 *   /api/employees*, /api/current-company, /api/groups → :3012 (pa_3012_people)
 *   /api/daily-wins*                                   → :3010 (pa_3010_daily_wins)
 *   /api/cad*                                          → :3004 (pa_3004_cad_manager)
 */
export default defineConfig({
    plugins: [react(), tailwindcss()],
    assetsInclude: ['**/*.svg', '**/*.csv'],

    server: {
        proxy: {
            // Auth server (pa_3000_user_login → port 3000)
            '/api/signin': { target: 'http://localhost:3000', changeOrigin: true },
            '/api/signout': { target: 'http://localhost:3000', changeOrigin: true },
            '/api/me': { target: 'http://localhost:3000', changeOrigin: true },
            '/api/refresh': { target: 'http://localhost:3000', changeOrigin: true },
            '/api/register': { target: 'http://localhost:3000', changeOrigin: true },
            '/api/change-password': { target: 'http://localhost:3000', changeOrigin: true },
            '/api/request-password-reset': { target: 'http://localhost:3000', changeOrigin: true },
            '/api/reset-password': { target: 'http://localhost:3000', changeOrigin: true },
            '/api/auth': { target: 'http://localhost:3000', changeOrigin: true },

            // People server (pa_3012_people → port 3012)
            '/api/employees': { target: 'http://localhost:3012', changeOrigin: true },
            '/api/current-company': { target: 'http://localhost:3012', changeOrigin: true },
            '/api/companies': { target: 'http://localhost:3012', changeOrigin: true },
            '/api/groups': { target: 'http://localhost:3012', changeOrigin: true },
            '/api/employee-departments': { target: 'http://localhost:3012', changeOrigin: true },
            '/api/employee-classifications': { target: 'http://localhost:3012', changeOrigin: true },

            // Daily Wins server (pa_3010_daily_wins → port 3010)
            '/api/daily-wins': { target: 'http://localhost:3010', changeOrigin: true },

            // CAD Manager server (pa_3004_cad_manager → port 3004)
            '/api/cad': { target: 'http://localhost:3004', changeOrigin: true },
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

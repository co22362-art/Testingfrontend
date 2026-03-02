/**
 * CONNECTED MAIN (Indestructible Entry Point)
 * ─────────────────────────────────────────────────────────
 * Figma continually overwrites src/main.tsx.
 * Our vite.dev.config.ts creates an alias so Vite serves *this* file 
 * instead of Figma's file when the app loads.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ConnectedApp from './App';
import '../styles/index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConnectedApp />
    </StrictMode>,
);

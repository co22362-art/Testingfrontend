import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// OUR connected app (src/connected/App.tsx) — not Figma's src/app/App.tsx
// Figma's App.tsx is kept as visual reference only; never rendered in production.
import ConnectedApp from './connected/App';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConnectedApp />
  </StrictMode>,
);
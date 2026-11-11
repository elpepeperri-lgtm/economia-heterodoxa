import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import '@fontsource-variable/bricolage-grotesque/wght.css';
import '@fontsource-variable/literata/wght.css';
import './diseno/base.css';
import { App } from './App.tsx';

try {
  const tema = localStorage.getItem('eh-tema');
  if (tema) document.documentElement.dataset.tema = tema;
} catch { /* sin almacenamiento */ }

registerSW({ immediate: true });

createRoot(document.getElementById('raiz')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

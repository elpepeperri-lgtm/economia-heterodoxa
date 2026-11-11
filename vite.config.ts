import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,webp,png,woff2}'],
        // Solo se guardan las letras latinas: las demás variantes de la tipografía no se usan.
        globIgnores: ['**/*-ext-*', '**/*vietnamese*', '**/*cyrillic*', '**/*greek*'],
      },
      manifest: {
        name: 'Economía Heterodoxa',
        short_name: 'Heterodoxa',
        description: 'Un juego para aprender economía desde todas sus escuelas.',
        lang: 'es',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#1d1934',
        theme_color: '#1d1934',
        icons: [
          { src: 'icono-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icono-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icono-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});

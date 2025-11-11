import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true }, // SW también en dev (útil para probar)
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Sistema de Administración',
        short_name: 'Admin',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0f172a',
        description: 'PWA offline con roles, mapa y sincronización',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        // Ajustes iniciales de cache
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          // API propia (la apuntaremos a /api desde el backend)
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          // Tiles/mapas e imágenes
          {
            urlPattern: ({ url }) =>
              url.hostname.includes('tile.openstreetmap.org') ||
              url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico)$/),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'assets-cache' }
          }
        ]
      }
    })
  ],
})

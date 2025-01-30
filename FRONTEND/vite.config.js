import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'CPNoter',
      short_name: 'CPNoter',
      description: 'A Note-taking and revision app for competitive programming',
      theme_color: '#1a1a1a',
      icons: [
        {
          src: '/logo.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/logo.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      start_url: '/',
      display: 'standalone',
      background_color: '#1a1a1a'
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
    }
  })],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    chunkSizeWarningLimit: 500 // Adjust the limit as needed
  },
})

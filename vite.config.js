import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'url'
import { ROUTE_SEO, ROUTE_HTML_FILES } from './src/lib/seo-config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Emit a static HTML file per non-root route with its own title, description
// and canonical, so crawlers don't see the homepage's tags on /advanced.
// index.html must use the '/' values from src/lib/seo-config.js verbatim.
function routeHtmlPlugin() {
  return {
    name: 'route-html',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const index = bundle['index.html']
      if (!index) return
      const home = ROUTE_SEO['/']
      const source = String(index.source)
      for (const tag of [home.title, home.description, `href="${home.canonical}"`]) {
        if (!source.includes(tag)) {
          this.error(`route-html: index.html no longer contains "${tag}"; keep it in sync with src/lib/seo-config.js`)
        }
      }
      for (const [route, fileName] of Object.entries(ROUTE_HTML_FILES)) {
        const seo = ROUTE_SEO[route]
        const html = source
          .replaceAll(home.title, seo.title)
          .replaceAll(home.description, seo.description)
          .replaceAll(`href="${home.canonical}"`, `href="${seo.canonical}"`)
          .replaceAll(`content="${home.canonical}"`, `content="${seo.canonical}"`)
        this.emitFile({ type: 'asset', fileName, source: html })
      }
    },
  }
}

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-astro': ['astronomia', 'suncalc'],
          'vendor-ui': ['lucide-react', 'clsx', 'tailwind-merge'],
        }
      }
    }
  },
  plugins: [
    react(),
    routeHtmlPlugin(),
    VitePWA({
      // "prompt": a new version waits for the user to tap "Reload Now" in the
      // update card instead of reloading the page under them
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'apple-touch-icon-180x180.png', 'badge-96x96.png', 'browserconfig.xml', 'icon-*.png'],
      manifest: {
        id: '/',
        name: 'Moon Mood - Vedic Astrology Dashboard',
        short_name: 'Moon Mood',
        description: 'Track Chandrashtam periods, Rahu Kalam and daily Panchang with Vedic astrology (Lahiri ayanamsa)',
        lang: 'en',
        dir: 'ltr',
        theme_color: '#8b5cf6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['lifestyle', 'utilities'],
        icons: [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-384x384.png', sizes: '384x384', type: 'image/png', purpose: 'any' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        shortcuts: [
          {
            name: 'Check My Status',
            short_name: 'Status',
            description: 'View your personal Chandrashtam status',
            url: '/',
            icons: [{ src: '/icon-96x96.png', sizes: '96x96', type: 'image/png' }]
          },
          {
            name: "Today's Details",
            short_name: 'Details',
            description: "Check today's Panchang and Rahu Kalam",
            url: '/advanced',
            icons: [{ src: '/icon-96x96.png', sizes: '96x96', type: 'image/png' }]
          },
          {
            name: 'View Calendar',
            short_name: 'Calendar',
            description: 'See the annual Chandrashtam calendar',
            url: '/advanced#annual-calendar',
            icons: [{ src: '/icon-96x96.png', sizes: '96x96', type: 'image/png' }]
          }
        ]
      },
      workbox: {
        // Handles notification taps (see public/sw-notifications.js)
        importScripts: ['sw-notifications.js'],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        globIgnores: ['**/node_modules/**/*'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache images
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache astronomical library files
            urlPattern: /astronomia|suncalc/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'astro-libs-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Network-first for HTML to get updates quickly
            urlPattern: /\.html$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Queue all Google Analytics requests when offline (GA4 + Universal)
            urlPattern: /^https:\/\/(www|region1|analytics)\.google-analytics\.com\/.*/i,
            handler: 'NetworkOnly',
            options: {
              backgroundSync: {
                name: 'analytics-queue',
                options: {
                  maxRetentionTime: 24 * 60 // Retry for up to 24 hours (in minutes)
                }
              }
            }
          },
          {
            // Queue Google Analytics 4 new domain requests
            urlPattern: /^https:\/\/analytics\.google\.com\/.*/i,
            handler: 'NetworkOnly',
            options: {
              backgroundSync: {
                name: 'ga4-queue',
                options: {
                  maxRetentionTime: 24 * 60 // Retry for up to 24 hours (in minutes)
                }
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    hmr: {
      overlay: false // This will disable the error overlay if you prefer
    }
  }
})
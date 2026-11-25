import tailwindcss from '@tailwindcss/vite'
import shopCatalog from './data/shop-catalog.json'
import { siteConfig } from './site.config'

const catalog = shopCatalog.items

function joinBase(base: string, path: string) {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const normalizedPath = path.replace(/^\//, '')
  return `${normalizedBase}${normalizedPath}`
}

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const baseURL = process.env.NUXT_APP_BASE_URL
  || (process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : '/')
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL
  || (process.env.GITHUB_ACTIONS && process.env.GITHUB_REPOSITORY_OWNER && repoName
    ? `https://${process.env.GITHUB_REPOSITORY_OWNER.toLowerCase()}.github.io/${repoName}`
    : 'http://localhost:3000')

const localePrefixes = ['', '/nl', '/es', '/fr', '/zh', '/ko', '/ja', '/pl', '/de', '/ru']
const staticPages = ['/', '/shop', '/about', '/faq', '/terms', '/returns', '/cards', '/cart', '/checkout', '/login', '/register', '/account']
const comingSoonRoutes = localePrefixes.map((prefix) => (prefix ? `${prefix}/coming-soon` : '/coming-soon'))
const prerenderRoutes = [
  ...localePrefixes.flatMap((prefix) => [
    ...staticPages.map((path) => (path === '/' ? (prefix || '/') : `${prefix}${path}`)),
    ...catalog.map((item) => `${prefix}/shop/${item.slug}`),
  ]),
  ...comingSoonRoutes,
  '/api/catalog',
  '/api/digital-art',
]

export default defineNuxtConfig({
  compatibilityDate: '2026-11-10',
  devtools: { enabled: false },
  modules: ['@nuxtjs/i18n', '@nuxtjs/color-mode', '@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    baseURL,
    head: {
      title: siteConfig.name,
      meta: [
        { name: 'theme-color', content: '#faf9fc' },
        {
          name: 'description',
          content: `${siteConfig.name} is a cozy studio shop for hand-drawn coloring books.`,
        },
        { property: 'og:site_name', content: siteConfig.name },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: joinBase(baseURL, 'favicon.svg') },
        { rel: 'apple-touch-icon', href: joinBase(baseURL, 'art/butterfly-favicon.png') },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  nitro: {
    // GitHub Pages CI sets NITRO_PRESET=github_pages. Default is Cloudflare Pages for live studio.
    preset: process.env.NITRO_PRESET || 'cloudflare_pages',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      pages: {
        routes: {
          // Stay under Cloudflare’s 100 exclude-rule limit with patterns, not every file.
          exclude: [
            '/_nuxt/*',
            '/_i18n/*',
            '/art/*',
            '/cursors/*',
            // /coming-soon stays on the Worker so unlocked cookies redirect
            // home before the gate page can paint.
            '/favicon.ico',
            '/favicon.svg',
            '/robots.txt',
            '/sitemap.xml',
          ],
        },
      },
    },
    prerender: process.env.NITRO_PRESET === 'github_pages'
      ? {
          crawlLinks: true,
          routes: prerenderRoutes,
        }
      : {
          // Keep shop/catalog SSR dynamic for D1/R2. Prerender the gated landing so
          // Cloudflare can serve it as static HTML (avoids intermittent Worker 1102).
          crawlLinks: false,
          routes: comingSoonRoutes,
        },
  },
  colorMode: {
    classSuffix: '',
    // Follow OS / browser light-dark (Windows, macOS, iOS, Android).
    preference: 'system',
    fallback: 'light',
    storage: 'cookie',
    storageKey: `${siteConfig.storagePrefix}-theme`,
  },
  fonts: {
    families: [
      {
        name: 'Dongle',
        provider: 'google',
        weights: [400, 700],
        subsets: ['latin'],
      },
      {
        name: 'Gaegu',
        provider: 'google',
        weights: [400, 700],
        subsets: ['latin', 'korean'],
      },
      {
        name: 'Single Day',
        provider: 'google',
        weights: [400],
        subsets: ['latin', 'korean'],
      },
      {
        name: 'Nanum Brush Script',
        provider: 'google',
        weights: [400],
        subsets: ['latin', 'korean'],
      },
      {
        name: 'Shippori Antique B1',
        provider: 'google',
        weights: [400],
        subsets: ['latin', 'japanese'],
      },
      {
        name: 'Kosugi Maru',
        provider: 'google',
        weights: [400],
        subsets: ['latin', 'japanese'],
      },
      {
        name: 'Nunito Sans',
        provider: 'google',
        weights: [400, 500, 600, 700],
        subsets: ['latin'],
      },
      {
        name: 'Ma Shan Zheng',
        provider: 'google',
        weights: [400],
        subsets: ['chinese-simplified'],
      },
      {
        name: 'ZCOOL KuaiLe',
        provider: 'google',
        weights: [400],
        subsets: ['chinese-simplified'],
      },
      {
        name: 'Caveat',
        provider: 'google',
        weights: [500, 600],
        subsets: ['latin', 'cyrillic'],
      },
    ],
  },
  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'nl', language: 'nl', name: 'Nederlands', file: 'nl.json' },
      { code: 'es', language: 'es', name: 'Español', file: 'es.json' },
      { code: 'fr', language: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json' },
      { code: 'ko', language: 'ko', name: '한국어', file: 'ko.json' },
      { code: 'ja', language: 'ja', name: '日本語', file: 'ja.json' },
      { code: 'pl', language: 'pl', name: 'Polski', file: 'pl.json' },
      { code: 'de', language: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'ru', language: 'ru', name: 'Русский', file: 'ru.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: `${siteConfig.storagePrefix}-locale`,
      redirectOn: 'root',
    },
    baseUrl: siteUrl,
    experimental: {
      // Serve locale JSON as static hashed files instead of a Nitro route (CF Worker).
      prerenderMessages: true,
      // Fewer duplicated locale routes → smaller Cloudflare Worker route table.
      compactRoutes: true,
      // Short browser cache on the messages endpoint fallback; hashed static files are immutable.
      httpCacheDuration: 60,
    },
  },

  runtimeConfig: {
    adminPassword: '',
    adminSessionSecret: '',
    /** When set, the public shop shows /coming-soon until visitors enter this code. */
    previewCode: '',
    public: {
      siteUrl,
      name: siteConfig.name,
      subtitle: siteConfig.subtitle,
      currency: siteConfig.currency,
      storagePrefix: siteConfig.storagePrefix,
      supportEmail: siteConfig.supportEmail,
      lowStockAt: siteConfig.lowStockAt,
    },
  },
})


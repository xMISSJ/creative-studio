import tailwindcss from '@tailwindcss/vite'
import { catalog } from './server/data/catalog'
import { siteConfig } from './site.config'

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
const staticPages = ['/', '/shop', '/about', '/faq', '/cart', '/checkout', '/login', '/register', '/account']
const prerenderRoutes = [
  ...localePrefixes.flatMap((prefix) => [
    ...staticPages.map((path) => (path === '/' ? (prefix || '/') : `${prefix}${path}`)),
    ...catalog.map((item) => `${prefix}/shop/${item.slug}`),
  ]),
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
    preset: 'github_pages',
    prerender: {
      crawlLinks: true,
      routes: prerenderRoutes,
    },
  },
  colorMode: {
    classSuffix: '',
    preference: 'light',
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
  },
  runtimeConfig: {
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

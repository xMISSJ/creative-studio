import tailwindcss from '@tailwindcss/vite'
import { siteConfig } from './site.config'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-10',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n', '@nuxtjs/color-mode', '@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: siteConfig.name,
      titleTemplate: `%s · ${siteConfig.name}`,
      meta: [{ name: 'theme-color', content: '#f8f7f4' }],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
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
        name: 'Fraunces',
        provider: 'google',
        weights: [500, 600, 700],
        styles: ['normal', 'italic'],
        subsets: ['latin'],
      },
      {
        name: 'Nunito Sans',
        provider: 'google',
        weights: [400, 500, 600, 700],
        subsets: ['latin'],
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
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json' },
      { code: 'ko', language: 'ko', name: '한국어', file: 'ko.json' },
      { code: 'ja', language: 'ja', name: '日本語', file: 'ja.json' },
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
      currency: siteConfig.currency,
      storagePrefix: siteConfig.storagePrefix,
      supportEmail: siteConfig.supportEmail,
      lowStockAt: siteConfig.lowStockAt,
    },
  },
})

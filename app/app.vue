<script setup lang="ts">
import { formatPageTitle } from '~~/site.config'
import { DEFAULT_OG_IMAGE } from '~/composables/useAbsoluteUrl'

const { locale, locales } = useI18n()
const i18nHead = useLocaleHead()
const brand = useBrand()
const { siteUrl, asset, page } = useAbsoluteUrl()
const appleTouchIcon = usePublicAsset('/art/butterfly-favicon.png')
const { t } = useShopI18n()

const htmlLang = computed(() => {
  const current = locales.value.find((entry) =>
    typeof entry === 'object' && entry.code === locale.value,
  )
  if (current && typeof current === 'object' && current.language) return current.language
  return locale.value
})

const siteLanguages = computed(() =>
  locales.value
    .map((entry) => (typeof entry === 'object' ? entry.language || entry.code : entry))
    .filter(Boolean),
)

useJsonLd('site-schema', () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl.value}/#organization`,
      name: brand.name,
      alternateName: brand.subtitle,
      url: siteUrl.value,
      email: brand.supportEmail,
      logo: {
        '@type': 'ImageObject',
        url: asset(DEFAULT_OG_IMAGE),
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl.value}/#website`,
      name: brand.name,
      url: page('/'),
      inLanguage: siteLanguages.value,
      publisher: { '@id': `${siteUrl.value}/#organization` },
      description: t('meta.homeDescription'),
    },
  ],
}))

// titleTemplate functions must live here — nuxt.config cannot serialize them to the client
useHead(() => ({
  htmlAttrs: {
    ...i18nHead.value.htmlAttrs,
    lang: htmlLang.value,
    'data-locale': locale.value,
    // Discourage browser auto-translate; the shop already ships real locales.
    translate: 'no',
  },
  link: [
    ...(i18nHead.value.link || []),
    { rel: 'apple-touch-icon', href: appleTouchIcon },
  ],
  meta: [
    ...(i18nHead.value.meta || []),
    { name: 'google', content: 'notranslate' },
  ],
  titleTemplate: (title) => formatPageTitle(title),
}))
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { formatPageTitle } from '~~/site.config'

const { locale, locales } = useI18n()
const i18nHead = useLocaleHead()

const htmlLang = computed(() => {
  const current = locales.value.find((entry) =>
    typeof entry === 'object' && entry.code === locale.value,
  )
  if (current && typeof current === 'object' && current.language) return current.language
  return locale.value
})

// titleTemplate functions must live here — nuxt.config cannot serialize them to the client
useHead(() => ({
  htmlAttrs: {
    ...i18nHead.value.htmlAttrs,
    lang: htmlLang.value,
    'data-locale': locale.value,
    // Discourage browser auto-translate; the shop already ships real locales.
    translate: 'no',
  },
  link: [...(i18nHead.value.link || [])],
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

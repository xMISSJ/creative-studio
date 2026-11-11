<script setup lang="ts">
import { collections } from '#shared/catalog'
import { formatPageTitle } from '~~/site.config'

const route = useRoute()
const localePath = useLocalePath()
const { t } = useShopI18n()
const slug = computed(() => String(route.params.slug))
const known = computed(() => collections.some((entry) => entry.slug === slug.value))

if (known.value) {
    await navigateTo(localePath({ path: '/shop', query: { type: 'coloring-books', theme: slug.value } }), {
    redirectCode: 301,
    replace: true,
  })
}

useSeoMeta({
  title: () => t('collections.missingTitle'),
  ogTitle: () => formatPageTitle(t('collections.missingTitle')),
  description: () => t('collections.missingBody'),
  robots: 'noindex',
})
</script>

<template>
  <section class="container-page py-12">
    <PageIntro :title="t('collections.missingTitle')" :lead="t('collections.missingBody')" />
    <NuxtLinkLocale class="btn btn-primary mt-8" to="/shop">{{ t('nav.shop') }}</NuxtLinkLocale>
  </section>
</template>

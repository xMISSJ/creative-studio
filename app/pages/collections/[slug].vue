<script setup lang="ts">
import { collections } from '#shared/catalog'

const route = useRoute()
const { t } = useShopI18n()
const { data, status, error, refresh } = await useCatalog()
const slug = computed(() => String(route.params.slug))
const known = computed(() => collections.some((entry) => entry.slug === slug.value))
const items = computed(() =>
  (data.value?.items ?? []).filter((item) => item.collection === slug.value).sort((a, b) => a.sort - b.sort),
)

useSeoMeta({
  title: () => (known.value ? t(`collections.${slug.value}.title`) : t('collections.missingTitle')),
  description: () => (known.value ? t(`collections.${slug.value}.summary`) : t('collections.missingBody')),
  robots: () => (known.value ? undefined : 'noindex'),
})
</script>

<template>
  <section class="container-page py-12">
    <div v-if="!known">
      <PageIntro :title="t('collections.missingTitle')" :lead="t('collections.missingBody')" />
      <NuxtLinkLocale class="btn btn-primary mt-8" to="/shop">{{ t('nav.shop') }}</NuxtLinkLocale>
    </div>
    <template v-else>
      <PageIntro
        :eyebrow="t('nav.shop')"
        :title="t(`collections.${slug}.title`)"
        :lead="t(`collections.${slug}.body`)"
      />
      <p v-if="error" class="mt-8" role="alert">
        {{ t('shop.loadError') }}
        <button type="button" class="link ms-2" @click="refresh()">{{ t('shop.retry') }}</button>
      </p>
      <p v-else-if="status === 'pending'" class="mt-8 text-muted">{{ t('shop.loading') }}</p>
      <p v-else-if="!items.length" class="mt-8 text-muted">{{ t('shop.empty') }}</p>
      <ProductGrid v-else class="mt-10" :items="items" />
    </template>
  </section>
</template>

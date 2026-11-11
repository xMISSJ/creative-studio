<script setup lang="ts">
const { t } = useShopI18n()
usePageMeta('meta.homeTitle', 'meta.homeDescription')

const { data, status, error, refresh } = await useCatalog()
const items = computed(() => data.value?.items ?? [])
const featured = computed(() => items.value.filter((item) => item.featured).sort((a, b) => a.sort - b.sort).slice(0, 4))
const arrivals = computed(() => {
  const fresh = items.value.filter((item) => item.badge === 'new').sort((a, b) => a.sort - b.sort)
  if (fresh.length >= 4) return fresh.slice(0, 4)
  return [...items.value].sort((a, b) => b.sort - a.sort).slice(0, 4)
})
</script>

<template>
  <div>
    <HeroBanner />

    <IntroBand />

    <p v-if="error" class="container-page py-6" role="alert">
      {{ t('shop.loadError') }}
      <button type="button" class="link ms-2" @click="refresh()">{{ t('shop.retry') }}</button>
    </p>
    <p v-else-if="status === 'pending'" class="container-page py-6 text-muted">{{ t('shop.loading') }}</p>
    <template v-else>
      <ProductShelf
        :title="t('home.bestsellerTitle')"
        :items="featured"
        :shop-label="t('home.shopNow')"
      />
      <ProductShelf
        :title="t('home.arrivalsTitle')"
        :items="arrivals"
        :shop-label="t('home.shopNow')"
      />
      <section class="container-page py-10 sm:py-12">
        <h2 class="section-title">{{ t('nav.shop') }}</h2>
        <ShopTypePicker class="mt-8" />
      </section>
    </template>

    <FaqList />
    <ValueProps />

    <div class="container-page py-10">
      <NewsletterPanel />
    </div>
  </div>
</template>

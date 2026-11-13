<script setup lang="ts">
usePageMeta('meta.checkoutTitle', 'meta.checkoutDescription', { robots: 'noindex, nofollow' })
const { t } = useShopI18n()
const { count, hydrated } = useCart()
</script>

<template>
  <section class="container-page py-12">
    <PageIntro :eyebrow="t('checkout.eyebrow')" :title="t('checkout.title')" :lead="t('checkout.body')" />
    <p v-if="hydrated && count === 0" class="mt-6 text-muted">{{ t('checkout.empty') }}</p>
    <CartLines v-else class="mt-8 max-w-3xl" />
    <NuxtLinkLocale class="btn btn-ghost mt-8" to="/cart">{{ t('checkout.back') }}</NuxtLinkLocale>
  </section>
</template>

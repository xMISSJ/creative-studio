<script setup lang="ts">
usePageMeta('meta.cartTitle', 'meta.cartDescription')
const { t } = useShopI18n()
const { count, hydrated } = useCart()
</script>

<template>
  <section class="container-page py-12">
    <PageIntro :eyebrow="t('nav.cart')" :title="t('cart.title')" :lead="t('cart.lead')" />
    <CartLines class="mt-8" />
    <NuxtLinkLocale v-if="hydrated && count === 0" class="btn btn-primary mt-8" to="/shop">{{ t('cart.shop') }}</NuxtLinkLocale>
    <NuxtLinkLocale v-else-if="hydrated" class="btn btn-primary mt-8" to="/checkout">{{ t('cart.checkout') }}</NuxtLinkLocale>
  </section>
</template>

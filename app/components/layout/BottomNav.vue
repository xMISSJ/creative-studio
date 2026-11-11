<script setup lang="ts">
const { t } = useShopI18n()
const { count } = useCart()
const { openCart } = useOverlay()
const route = useRoute()

const onShop = computed(() => route.path.includes('/shop') || route.path.includes('/collections'))
const onAccount = computed(() => /\/(account|login|register)/.test(route.path))
</script>

<template>
  <nav
    class="bottom-nav fixed inset-x-0 bottom-0 z-40 md:hidden"
    :aria-label="t('nav.mobile')"
  >
    <div class="mx-auto grid max-w-lg grid-cols-4 pb-safe">
      <NuxtLinkLocale
        to="/shop"
        class="flex min-h-14 flex-col items-center justify-center gap-1 text-muted"
        :aria-current="onShop ? 'page' : undefined"
        :aria-label="t('nav.shop')"
      >
        <AppIcon name="search" />
      </NuxtLinkLocale>
      <NuxtLinkLocale
        to="/shop"
        class="flex min-h-14 flex-col items-center justify-center gap-1 text-muted"
        :aria-label="t('nav.wishlist')"
      >
        <AppIcon name="heart" />
      </NuxtLinkLocale>
      <button
        type="button"
        class="relative flex min-h-14 flex-col items-center justify-center gap-1 text-muted"
        :aria-label="t('cart.open', { count })"
        @click="openCart"
      >
        <AppIcon name="cart" />
        <span
          class="absolute top-2 end-1/2 translate-x-3 grid min-w-5 place-items-center rounded-full bg-[var(--button)] px-1 text-[0.65rem] font-bold text-[var(--on-button)]"
          aria-hidden="true"
        >
          {{ count }}
        </span>
      </button>
      <NuxtLinkLocale
        to="/account"
        class="flex min-h-14 flex-col items-center justify-center gap-1 text-muted"
        :aria-current="onAccount ? 'page' : undefined"
        :aria-label="t('nav.account')"
      >
        <AppIcon name="user" />
      </NuxtLinkLocale>
    </div>
  </nav>
</template>

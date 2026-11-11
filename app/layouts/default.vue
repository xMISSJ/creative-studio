<script setup lang="ts">
const { t } = useShopI18n()
const route = useRoute()
const { menuOpen, locked, cart } = useOverlay()

watch(() => route.fullPath, () => {
  menuOpen.value = false
  cart.isOpen.value = false
})

watch(locked, (value) => {
  if (!import.meta.client) return
  document.documentElement.classList.toggle('overflow-hidden', value)
})

onBeforeUnmount(() => {
  if (import.meta.client) document.documentElement.classList.remove('overflow-hidden')
})
</script>

<template>
  <div class="relative flex min-h-dvh flex-col overflow-x-clip">
    <a class="skip-link btn" href="#main">{{ t('nav.skip') }}</a>
    <AppHeader />
    <div class="flex flex-1 flex-col pb-bottom-nav" :inert="locked ? true : undefined">
      <main id="main" class="flex-1">
        <slot />
      </main>
      <AppFooter />
    </div>
    <CartDrawer />
    <MobileMenu />
    <BottomNav />
  </div>
</template>

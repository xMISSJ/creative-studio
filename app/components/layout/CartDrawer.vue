<script setup lang="ts">
const { t } = useShopI18n()
const { isOpen, close, count, hydrated } = useCart()
const panel = ref<HTMLElement | null>(null)

useFocusTrap(isOpen, panel)
</script>

<template>
  <Transition name="drawer">
    <div v-if="isOpen" class="fixed inset-0 z-50">
      <div class="scrim absolute inset-0" aria-hidden="true" @click="close" />
      <aside
        id="cart-drawer"
        ref="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        class="drawer-panel absolute top-0 right-0 flex h-dvh w-full max-w-md flex-col bg-paper shadow-2xl"
      >
        <div class="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="cart-title" class="display-title text-3xl">{{ t('cart.title') }}</h2>
          <button type="button" class="icon-btn" data-autofocus :aria-label="t('cart.close')" @click="close">
            <AppIcon name="close" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto px-5 py-4">
          <CartLines />
        </div>
        <div v-if="hydrated && count > 0" class="grid gap-2 border-t border-line px-5 pt-4 pb-safe">
          <NuxtLinkLocale class="btn btn-ghost w-full" to="/cart" @click="close">{{ t('cart.view') }}</NuxtLinkLocale>
          <NuxtLinkLocale class="btn btn-primary w-full" to="/checkout" @click="close">{{ t('cart.checkout') }}</NuxtLinkLocale>
        </div>
        <div v-else-if="hydrated" class="px-5 pt-2 pb-safe">
          <NuxtLinkLocale class="btn btn-primary w-full" to="/shop" @click="close">{{ t('cart.shop') }}</NuxtLinkLocale>
        </div>
      </aside>
    </div>
  </Transition>
</template>

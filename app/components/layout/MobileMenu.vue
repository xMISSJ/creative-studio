<script setup lang="ts">
const { t } = useShopI18n()
const { menuOpen, closeMenu } = useOverlay()
const panel = ref<HTMLElement | null>(null)

useFocusTrap(menuOpen, panel)
</script>

<template>
  <Transition name="drawer">
    <div v-if="menuOpen" class="fixed inset-0 z-50">
      <div class="scrim absolute inset-0" aria-hidden="true" @click="closeMenu" />
      <div
        id="mobile-menu"
        ref="panel"
        role="dialog"
        aria-modal="true"
        :aria-label="t('nav.primary')"
        class="drawer-panel absolute inset-y-0 start-0 flex w-[min(20rem,88vw)] flex-col gap-4 overflow-y-auto bg-canvas px-5 pt-5 pb-safe shadow-xl"
      >
        <div class="flex items-center justify-between">
          <AppLogo />
          <button type="button" class="icon-btn" data-autofocus :aria-label="t('nav.close')" @click="closeMenu">
            <AppIcon name="close" />
          </button>
        </div>
        <nav class="grid gap-1" :aria-label="t('nav.primary')">
          <NuxtLinkLocale class="nav-link text-xl font-display" to="/" @click="closeMenu">{{ t('nav.home') }}</NuxtLinkLocale>
          <NuxtLinkLocale class="nav-link text-xl font-display" to="/shop" @click="closeMenu">{{ t('nav.shop') }}</NuxtLinkLocale>
          <NuxtLinkLocale class="nav-link text-xl font-display" to="/faq" @click="closeMenu">{{ t('nav.faq') }}</NuxtLinkLocale>
          <NuxtLinkLocale class="nav-link text-xl font-display" to="/about" @click="closeMenu">{{ t('nav.about') }}</NuxtLinkLocale>
          <NuxtLinkLocale class="nav-link text-xl font-display" to="/account" @click="closeMenu">{{ t('nav.account') }}</NuxtLinkLocale>
          <NuxtLinkLocale class="nav-link" to="/login" @click="closeMenu">{{ t('nav.login') }}</NuxtLinkLocale>
          <NuxtLinkLocale class="nav-link" to="/register" @click="closeMenu">{{ t('nav.register') }}</NuxtLinkLocale>
        </nav>
        <LocaleSwitcher variant="menu" />
        <div class="mt-auto">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </Transition>
</template>

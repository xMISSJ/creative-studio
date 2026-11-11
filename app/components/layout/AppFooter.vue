<script setup lang="ts">
const { t, brand } = useShopI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 border-t border-line bg-paper">
    <div class="container-page py-12">
      <div class="flex flex-col items-center gap-4 text-center">
        <AppLogo centered />
        <p class="max-w-md text-sm text-muted">{{ t('footer.note') }}</p>
      </div>

      <nav class="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-bold" :aria-label="t('footer.visit')">
        <NuxtLinkLocale class="text-muted hover:text-accent" to="/about">{{ t('nav.about') }}</NuxtLinkLocale>
        <NuxtLinkLocale class="text-muted hover:text-accent" to="/shop">{{ t('nav.shop') }}</NuxtLinkLocale>
        <NuxtLinkLocale class="text-muted hover:text-accent" to="/account">{{ t('nav.account') }}</NuxtLinkLocale>
        <NuxtLinkLocale class="text-muted hover:text-accent" to="/login">{{ t('nav.login') }}</NuxtLinkLocale>
      </nav>

      <p class="mt-8 text-center text-sm text-muted">{{ t('footer.rights', { year }) }}</p>
      <p class="mt-2 text-center text-sm text-muted" translate="no">{{ brand.supportEmail }}</p>
    </div>
  </footer>
</template>

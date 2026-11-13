<script setup lang="ts">
const { t, brand } = useShopI18n()
const logoMark = usePublicAsset('/art/logo-black-outline.png')
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 border-t border-line bg-paper">
    <div class="container-page py-12">
      <div class="flex flex-col items-center gap-4 text-center">
        <NuxtLinkLocale
          to="/"
          class="inline-flex rounded-full"
          :aria-label="`${brand.name} ${brand.subtitle}`"
        >
          <img
            :src="logoMark"
            alt=""
            width="128"
            height="128"
            class="size-28 dark:invert sm:size-32"
            decoding="async"
          >
        </NuxtLinkLocale>
        <p class="max-w-md text-sm text-muted">{{ t('footer.note') }}</p>
      </div>

      <nav class="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm" :aria-label="t('footer.visit')">
        <NuxtLinkLocale class="footer-link" to="/about">{{ t('nav.about') }}</NuxtLinkLocale>
        <NuxtLinkLocale class="footer-link" to="/shop">{{ t('nav.shop') }}</NuxtLinkLocale>
        <NuxtLinkLocale class="footer-link" to="/faq">{{ t('nav.faq') }}</NuxtLinkLocale>
        <NuxtLinkLocale class="footer-link" to="/account">{{ t('nav.account') }}</NuxtLinkLocale>
        <NuxtLinkLocale class="footer-link" to="/login">{{ t('nav.login') }}</NuxtLinkLocale>
      </nav>

      <p class="mt-8 text-center text-sm text-muted">{{ t('footer.rights', { year }) }}</p>
      <p class="mt-2 text-center text-sm text-muted" translate="no">{{ brand.supportEmail }}</p>
    </div>
  </footer>
</template>

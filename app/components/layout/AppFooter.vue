<script setup lang="ts">
const { t, brand } = useShopI18n()
const logoMark = usePublicAsset('/art/logo-black-outline.png')
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-line bg-paper">
    <div class="container-page py-12 sm:py-14">
      <div class="flex flex-col items-center gap-3 text-center">
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

      <nav
        class="mt-4 flex flex-wrap items-center justify-center gap-x-1 gap-y-0 text-sm sm:mt-5"
        :aria-label="t('footer.visit')"
      >
        <NuxtLinkLocale class="footer-link" to="/about">{{ t('nav.about') }}</NuxtLinkLocale>
        <NuxtLinkLocale class="footer-link" to="/shop">{{ t('nav.shop') }}</NuxtLinkLocale>
        <NuxtLinkLocale class="footer-link" to="/cards">{{ t('nav.cards') }}</NuxtLinkLocale>
        <NuxtLinkLocale class="footer-link" to="/faq">{{ t('nav.faq') }}</NuxtLinkLocale>
        <NuxtLinkLocale class="footer-link" to="/account">{{ t('nav.account') }}</NuxtLinkLocale>
        <NuxtLinkLocale class="footer-link" to="/login">{{ t('nav.login') }}</NuxtLinkLocale>
      </nav>

      <div class="mx-auto -mt-3 flex max-w-lg flex-col items-center text-center text-sm text-muted sm:-mt-4">
        <nav
          class="flex flex-wrap items-center justify-center gap-x-1"
          :aria-label="t('footer.legal')"
        >
          <NuxtLinkLocale class="footer-meta-link" to="/terms">{{ t('nav.terms') }}</NuxtLinkLocale>
          <span class="px-1 text-muted" aria-hidden="true">·</span>
          <NuxtLinkLocale class="footer-meta-link" to="/returns">{{ t('nav.returns') }}</NuxtLinkLocale>
        </nav>
        <p class="mt-5 sm:mt-6">{{ t('footer.rights', { year }) }}</p>
        <p class="mt-1" translate="no">{{ brand.supportEmail }}</p>
      </div>
    </div>
  </footer>
</template>

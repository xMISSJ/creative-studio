<script setup lang="ts">
const { t } = useShopI18n()
const { shopHomeLink } = useShopBrowse()
</script>

<template>
  <nav class="shop-filters" :aria-label="t('nav.shop')">
    <NuxtLinkLocale class="chip shrink-0" :to="shopHomeLink()">
      {{ t('shop.back') }}
    </NuxtLinkLocale>
  </nav>
</template>

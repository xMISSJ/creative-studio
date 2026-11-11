<script setup lang="ts">
const { t } = useShopI18n()
const { shopHomeLink } = useShopBrowse()
</script>

<template>
  <div class="shop-filters">
    <ul class="flex list-none gap-2 overflow-x-auto pb-2" :aria-label="t('shop.back')">
      <li>
        <NuxtLinkLocale class="chip shrink-0" :to="shopHomeLink()">
          {{ t('shop.back') }}
        </NuxtLinkLocale>
      </li>
    </ul>
  </div>
</template>

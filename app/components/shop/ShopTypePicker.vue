<script setup lang="ts">
import { productTypes } from '#shared/catalog'

const { t } = useShopI18n()
const { shopLink } = useShopBrowse()
</script>

<template>
  <ul class="flex list-none flex-col gap-4" :aria-label="t('meta.shopTitle')">
    <li
      v-for="(type, index) in productTypes"
      :key="type.slug"
      class="rise"
      :class="index === 0 ? 'delay-1' : index === 1 ? 'delay-2' : 'delay-3'"
    >
      <NuxtLinkLocale
        :to="shopLink({ type: type.slug })"
        class="group flex min-h-[9rem] w-full flex-col justify-between gap-6 rounded-md px-6 py-6 text-on-soft transition sm:min-h-[8.5rem] sm:flex-row sm:items-end sm:px-8 sm:py-7"
        :class="type.accent"
      >
        <div class="min-w-0">
          <p class="text-xs font-bold tracking-[0.08em] uppercase opacity-80">
            <template v-if="type.slug === 'digital-art'">{{ t('shop.digitalArt.badge') }}</template>
            <template v-else-if="type.ready">{{ t('shop.openNow') }}</template>
            <template v-else>{{ t('shop.comingSoon') }}</template>
          </p>
          <h2 class="display-title mt-2 text-3xl sm:text-4xl">
            {{ t(`productTypes.${type.slug}.title`) }}
          </h2>
        </div>
        <p class="max-w-md text-sm leading-relaxed opacity-90 sm:text-right sm:text-base">
          {{ t(`productTypes.${type.slug}.summary`) }}
        </p>
      </NuxtLinkLocale>
    </li>
  </ul>
</template>

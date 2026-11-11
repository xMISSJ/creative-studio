<script setup lang="ts">
import type { CatalogItem } from '#shared/catalog'

const props = defineProps<{
  primary?: CatalogItem
  secondary?: CatalogItem
}>()

const { t } = useShopI18n()
</script>

<template>
  <div v-if="props.primary" class="relative mx-auto h-[28rem] w-full max-w-lg sm:h-[34rem]">
    <p class="absolute left-0 top-0 z-10 rounded-full bg-blush px-4 py-2 text-sm font-extrabold text-on-soft">
      {{ t('hero.badge') }}
    </p>
    <div class="drift absolute top-10 right-0 w-[78%]">
      <div class="-rotate-2">
        <NuxtLinkLocale :to="`/shop/${props.primary.slug}`" class="mat block">
          <img
            :src="props.primary.image"
            :alt="t(`products.${props.primary.slug}.title`)"
            width="800"
            height="1000"
            class="aspect-square w-full rounded-[1.2rem] object-cover"
            fetchpriority="high"
            decoding="async"
          >
        </NuxtLinkLocale>
      </div>
    </div>
    <div v-if="props.secondary" class="absolute bottom-2 left-0 w-[48%] rotate-3">
      <NuxtLinkLocale :to="`/shop/${props.secondary.slug}`" class="mat block">
        <img
          :src="props.secondary.image"
          :alt="t(`products.${props.secondary.slug}.title`)"
          width="800"
          height="1000"
          class="aspect-square w-full rounded-[1.2rem] object-cover"
          decoding="async"
        >
      </NuxtLinkLocale>
    </div>
  </div>
</template>

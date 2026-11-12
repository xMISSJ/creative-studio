<script setup lang="ts">
import type { CatalogItem } from '#shared/catalog'

defineProps<{
  item: CatalogItem
}>()

const { t } = useShopI18n()
const format = useFormatPrice()
</script>

<template>
  <article class="group">
    <NuxtLinkLocale :to="`/shop/${item.slug}`" class="block rounded-md focus-visible:outline">
      <div class="relative overflow-hidden rounded-md lift">
        <img
          :src="item.image"
          alt=""
          width="800"
          height="800"
          class="aspect-square w-full object-cover"
          loading="lazy"
          decoding="async"
        >
        <span
          v-if="item.badge"
          class="absolute left-3 top-3 rounded-full bg-paper/95 px-3 py-1 text-xs font-bold text-ink"
        >
          {{ t(`badges.${item.badge}`) }}
        </span>
      </div>
      <div class="mt-3 px-0.5">
        <h3 class="text-[1.05rem] leading-snug font-bold text-ink">
          {{ t(`products.${item.slug}.title`) }}
        </h3>
        <p class="price mt-1 text-[1.05rem]">{{ format(item.price) }}</p>
      </div>
    </NuxtLinkLocale>
  </article>
</template>

<script setup lang="ts">
import type { CatalogItem } from '#shared/catalog'

const props = defineProps<{
  item?: CatalogItem
}>()

const { t } = useShopI18n()
</script>

<template>
  <section class="container-page pt-6 sm:pt-10">
    <div class="hero-frame relative min-h-[22rem] sm:min-h-[26rem]">
      <div class="relative z-10 grid h-full items-center gap-6 p-6 sm:grid-cols-[1.1fr_0.9fr] sm:p-10 lg:p-12">
        <div class="rise max-w-md">
          <h1 class="font-display text-4xl leading-[1.05] font-bold text-[#5b3d2e] sm:text-5xl lg:text-6xl">
            {{ t('hero.title') }}
          </h1>
          <p class="mt-4 max-w-sm text-base text-[#6b5346] sm:text-lg">
            {{ t('hero.lead') }}
          </p>
          <div class="mt-6">
            <NuxtLinkLocale class="btn btn-primary" to="/shop">
              {{ t('hero.shop') }}
            </NuxtLinkLocale>
          </div>
        </div>

        <div v-if="props.item" class="rise delay-1 mx-auto w-full max-w-[16rem] sm:max-w-[18rem]">
          <NuxtLinkLocale :to="`/shop/${props.item.slug}`" class="block">
            <img
              :src="props.item.image"
              :alt="t(`products.${props.item.slug}.alt`)"
              width="800"
              height="800"
              class="aspect-square w-full rounded-[1.5rem] object-cover shadow-[0_20px_40px_-24px_rgba(60,40,30,0.45)]"
              fetchpriority="high"
              decoding="async"
            >
          </NuxtLinkLocale>
          <p class="mt-3 text-center text-sm font-bold text-[#5b3d2e]">
            {{ t(`products.${props.item.slug}.title`) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

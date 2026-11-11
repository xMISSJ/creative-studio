<script setup lang="ts">
import type { CatalogItem } from '#shared/catalog'

const props = defineProps<{
  item?: CatalogItem
}>()

const { t } = useShopI18n()
</script>

<template>
  <section class="bg-lilac text-on-soft">
    <div class="container-page grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="rise">
        <PageIntro :eyebrow="t('hero.eyebrow')" :title="t('hero.title')" :lead="t('hero.lead')" />
        <div class="mt-8">
          <NuxtLinkLocale class="btn btn-primary" to="/shop">
            {{ t('hero.shop') }}
          </NuxtLinkLocale>
        </div>
      </div>

      <div v-if="props.item" class="mat rise delay-1">
        <NuxtLinkLocale :to="`/shop/${props.item.slug}`" class="block">
          <img
            :src="props.item.image"
            :alt="t(`products.${props.item.slug}.alt`)"
            width="800"
            height="800"
            class="aspect-square w-full rounded-[1.2rem] object-cover"
            fetchpriority="high"
            decoding="async"
          >
        </NuxtLinkLocale>
      </div>
    </div>
  </section>
</template>

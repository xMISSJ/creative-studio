<script setup lang="ts">
import type { CatalogItem } from '#shared/catalog'

defineProps<{
  title: string
  items: CatalogItem[]
  shopLabel: string
  soft?: boolean
}>()
</script>

<template>
  <section class="home-band" :class="soft ? 'home-band-soft' : ''">
    <div class="container-page">
      <div class="text-center">
        <h2 class="section-title">{{ title }}</h2>
        <NuxtLinkLocale class="shop-now mt-4" to="/shop">
          {{ shopLabel }}
          <AppIcon name="chevron" />
        </NuxtLinkLocale>
      </div>
      <ProductGrid class="mt-10" :items="items" />
    </div>
  </section>
</template>

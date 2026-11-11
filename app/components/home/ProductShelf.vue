<script setup lang="ts">
import type { CatalogItem } from '#shared/catalog'

defineProps<{
  title: string
  items: CatalogItem[]
  shopLabel: string
}>()
</script>

<template>
  <section class="container-page py-10 sm:py-12">
    <div class="text-center">
      <h2 class="section-title">{{ title }}</h2>
      <NuxtLinkLocale class="shop-now mt-3" to="/shop">
        {{ shopLabel }}
        <AppIcon name="chevron" />
      </NuxtLinkLocale>
    </div>
    <ProductGrid class="mt-8" :items="items" />
  </section>
</template>

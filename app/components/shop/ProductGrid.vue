<script setup lang="ts">
import type { CatalogItem } from '#shared/catalog'

defineProps<{
  items: CatalogItem[]
}>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
    <ProductCard v-for="item in items" :key="item.slug" :item="item" />
  </div>
</template>

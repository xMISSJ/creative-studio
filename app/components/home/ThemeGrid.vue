<script setup lang="ts">
import { collections } from '#shared/catalog'
import type { CatalogItem } from '#shared/catalog'

const props = defineProps<{
  items: CatalogItem[]
}>()

const { t } = useShopI18n()

const openCollections = computed(() =>
  collections
    .filter((entry) => props.items.some((item) => item.collection === entry.slug))
    .map((entry) => {
      const cover = props.items.find((item) => item.collection === entry.slug)
      return { ...entry, cover }
    }),
)
</script>

<template>
  <section class="container-page py-10 sm:py-12">
    <h2 class="section-title">{{ t('home.themeTitle') }}</h2>
    <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <NuxtLinkLocale
        v-for="collection in openCollections"
        :key="collection.slug"
        :to="`/collections/${collection.slug}`"
        class="group block"
      >
        <div class="overflow-hidden rounded-[1.25rem]">
          <img
            v-if="collection.cover"
            :src="collection.cover.image"
            alt=""
            width="800"
            height="800"
            class="aspect-square w-full object-cover transition group-hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
          >
          <div
            v-else
            class="aspect-square w-full"
            :class="collection.accent"
          />
        </div>
        <p class="mt-3 text-center text-lg font-bold capitalize text-ink">
          {{ t(`collections.${collection.slug}.title`) }}
        </p>
      </NuxtLinkLocale>
    </div>
  </section>
</template>

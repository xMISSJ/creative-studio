<script setup lang="ts">
import { collections } from '#shared/catalog'
import type { CatalogItem } from '#shared/catalog'

const props = withDefaults(defineProps<{
  items: CatalogItem[]
  title?: string
  contained?: boolean
}>(), {
  contained: true,
})

const { t } = useShopI18n()
const { themeLink } = useShopBrowse()

const heading = computed(() => props.title ?? t('home.themeTitle'))

const coloringItems = computed(() => props.items.filter((item) => item.type === 'coloring-books'))

const openCollections = computed(() =>
  collections
    .filter((entry) => coloringItems.value.some((item) => item.collection === entry.slug))
    .map((entry) => {
      const cover = coloringItems.value.find((item) => item.collection === entry.slug)
      return { ...entry, cover }
    }),
)
</script>

<template>
  <section :class="contained ? 'container-page py-10 sm:py-12' : 'py-2'">
    <h2 class="section-title">{{ heading }}</h2>
    <ul class="mt-8 flex list-none flex-col gap-4">
      <li v-for="collection in openCollections" :key="collection.slug">
        <NuxtLinkLocale
          :to="themeLink(collection.slug)"
          class="group block w-full"
        >
          <div class="overflow-hidden">
            <img
              v-if="collection.cover"
              :src="collection.cover.image"
              alt=""
              width="1400"
              height="560"
              class="aspect-[2.5/1] w-full object-cover transition group-hover:scale-[1.01]"
              loading="lazy"
              decoding="async"
            >
            <div
              v-else
              class="aspect-[2.5/1] w-full"
              :class="collection.accent"
            />
          </div>
          <div class="mt-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <p class="display-title text-2xl text-ink sm:text-3xl">
              {{ t(`collections.${collection.slug}.title`) }}
            </p>
            <p class="max-w-xl text-sm text-muted sm:text-right sm:text-base">
              {{ t(`collections.${collection.slug}.summary`) }}
            </p>
          </div>
        </NuxtLinkLocale>
      </li>
    </ul>
  </section>
</template>

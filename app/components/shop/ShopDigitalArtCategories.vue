<script setup lang="ts">
import { digitalArtCategories } from '#shared/catalog'

const { t } = useShopI18n()
const { activeDigitalCategory, digitalCategoryLink } = useShopBrowse()

const activeIndex = computed(() =>
  Math.max(0, digitalArtCategories.findIndex((entry) => entry.slug === activeDigitalCategory.value)),
)
</script>

<template>
  <nav class="flex justify-center" :aria-label="t('shop.digitalArt.categoriesTitle')">
    <ul
      class="digital-art-tabs relative grid w-full max-w-md list-none grid-cols-2 gap-1 rounded-full border border-line bg-paper p-1 shadow-[0_12px_28px_-22px_rgba(58,51,72,0.45)]"
      :style="{ '--tab-index': activeIndex }"
    >
      <span class="digital-art-tab-pill" aria-hidden="true" />
      <li v-for="category in digitalArtCategories" :key="category.slug">
        <NuxtLinkLocale
          :to="digitalCategoryLink(category.slug)"
          class="digital-art-tab relative z-10 flex min-h-11 items-center justify-center rounded-full px-3 text-center text-sm font-bold sm:text-base"
          :class="activeDigitalCategory === category.slug
            ? 'text-[var(--on-button)]'
            : 'text-muted hover:text-ink'"
          :aria-current="activeDigitalCategory === category.slug ? 'true' : undefined"
        >
          {{ t(`digitalArt.categories.${category.slug}.title`) }}
        </NuxtLinkLocale>
      </li>
    </ul>
  </nav>
</template>

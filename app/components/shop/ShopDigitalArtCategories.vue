<script setup lang="ts">
import { digitalArtCategories } from '#shared/catalog'

const { t } = useShopI18n()
const { activeDigitalCategory, digitalCategoryLink } = useShopBrowse()

const activeIndex = computed(() =>
  Math.max(0, digitalArtCategories.findIndex((entry) => entry.slug === activeDigitalCategory.value)),
)
</script>

<template>
  <nav :aria-label="t('shop.digitalArt.categoriesTitle')">
    <div
      class="digital-art-tabs relative grid grid-cols-2 gap-1 rounded-[1rem] border border-line bg-paper p-1"
      role="list"
      :style="{ '--tab-index': activeIndex }"
    >
      <span class="digital-art-tab-pill" aria-hidden="true" />
      <NuxtLinkLocale
        v-for="category in digitalArtCategories"
        :key="category.slug"
        :to="digitalCategoryLink(category.slug)"
        role="listitem"
        class="digital-art-tab relative z-10 flex min-h-11 items-center justify-center rounded-[0.75rem] px-3 text-center text-sm font-bold sm:text-base"
        :class="activeDigitalCategory === category.slug
          ? 'text-white'
          : 'text-muted hover:text-ink'"
        :aria-current="activeDigitalCategory === category.slug ? 'true' : undefined"
      >
        {{ t(`digitalArt.categories.${category.slug}.title`) }}
      </NuxtLinkLocale>
    </div>
  </nav>
</template>

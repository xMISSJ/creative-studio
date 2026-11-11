<script setup lang="ts">
import { collections } from '#shared/catalog'
import type { CatalogItem } from '#shared/catalog'

const props = defineProps<{
  items: CatalogItem[]
}>()

const { t } = useShopI18n()
const { activeTheme, shopLink, themeLink } = useShopBrowse()

const themes = computed(() =>
  collections.map((entry) => {
    const cover = props.items.find(
      (item) => item.type === 'coloring-books' && item.collection === entry.slug,
    )
    return { ...entry, cover }
  }),
)
</script>

<template>
  <section class="mt-8" aria-labelledby="shop-themes-title">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <h2 id="shop-themes-title" class="font-display text-2xl font-bold text-ink sm:text-3xl">
        {{ t('shop.themesTitle') }}
      </h2>
      <NuxtLinkLocale
        v-if="activeTheme !== 'all'"
        class="link text-sm"
        :to="shopLink({ type: 'coloring-books' })"
      >
        {{ t('shop.allThemes') }}
      </NuxtLinkLocale>
    </div>

    <ul class="mt-5 grid list-none grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4" :aria-label="t('shop.themesTitle')">
      <li v-for="theme in themes" :key="theme.slug">
        <NuxtLinkLocale
          :to="themeLink(theme.slug)"
          class="group block rounded-[1.15rem] focus-visible:outline"
          :aria-current="activeTheme === theme.slug ? 'true' : undefined"
        >
          <div
            class="overflow-hidden rounded-[1.15rem] ring-offset-2 ring-offset-canvas transition"
            :class="activeTheme === theme.slug ? 'ring-2 ring-accent' : 'ring-0'"
          >
            <img
              v-if="theme.cover"
              :src="theme.cover.image"
              alt=""
              width="400"
              height="400"
              class="aspect-square w-full object-cover transition group-hover:scale-[1.02]"
              loading="lazy"
              decoding="async"
            >
            <div
              v-else
              class="aspect-square w-full"
              :class="theme.accent"
            />
          </div>
          <p
            class="mt-2 text-center text-xs leading-snug font-bold sm:mt-3 sm:text-base"
            :class="activeTheme === theme.slug ? 'text-accent' : 'text-ink'"
          >
            {{ t(`collections.${theme.slug}.title`) }}
          </p>
        </NuxtLinkLocale>
      </li>
    </ul>
  </section>
</template>

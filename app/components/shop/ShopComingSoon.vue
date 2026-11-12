<script setup lang="ts">
import { productTypes } from '#shared/catalog'
import type { ProductTypeSlug } from '#shared/catalog'

const props = defineProps<{
  type: ProductTypeSlug
}>()

const { t } = useShopI18n()
const { shopHomeLink, shopLink } = useShopBrowse()

const accent = computed(() =>
  productTypes.find((entry) => entry.slug === props.type)?.accent ?? 'bg-lilac-mist',
)
</script>

<template>
  <div class="mt-10 flex flex-col gap-4">
    <div
      class="w-full px-6 py-8 text-on-soft sm:px-8 sm:py-10"
      :class="accent"
    >
      <p class="text-xs font-bold tracking-[0.08em] uppercase opacity-80">{{ t('shop.comingSoon') }}</p>
      <h2 class="display-title mt-4 max-w-3xl text-3xl sm:text-4xl">
        {{ t('shop.comingSoonTitle') }}
      </h2>
      <p class="mt-4 max-w-2xl text-base leading-relaxed opacity-90 sm:text-lg">
        {{ t('shop.comingSoonBody') }}
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <NuxtLinkLocale class="btn btn-primary" :to="shopLink({ type: 'coloring-books' })">
          {{ t('shop.comingSoonCta') }}
        </NuxtLinkLocale>
        <NuxtLinkLocale class="btn btn-ghost border-on-soft/25 text-on-soft" :to="shopHomeLink()">
          {{ t('shop.back') }}
        </NuxtLinkLocale>
      </div>
    </div>

    <div class="w-full border-y border-line py-6">
      <p class="display-title text-2xl text-ink">{{ t(`productTypes.${type}.title`) }}</p>
      <p class="mt-3 max-w-2xl text-base leading-relaxed text-muted">{{ t(`productTypes.${type}.summary`) }}</p>
    </div>
  </div>
</template>

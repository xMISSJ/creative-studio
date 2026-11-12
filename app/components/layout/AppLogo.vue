<script setup lang="ts">
defineProps<{
  centered?: boolean
}>()

const { brand } = useShopI18n()
</script>

<template>
  <NuxtLinkLocale
    to="/"
    class="relative inline-flex min-w-0 items-center justify-center rounded-full"
    :class="centered ? 'mx-auto' : ''"
    :aria-label="`${brand.name} ${brand.subtitle}`"
  >
    <span
      class="flex min-w-0 flex-col leading-none"
      :class="centered ? 'items-center text-center' : 'items-start text-start'"
      translate="no"
    >
      <span class="truncate font-logo text-[1.65rem] font-bold tracking-tight text-ink [word-spacing:-0.2em] sm:text-[1.85rem]">
        {{ brand.name }}
      </span>
      <span
        class="font-about-mark -mt-1 text-[1.3rem] leading-none text-ink/80 sm:text-[1.45rem]"
        lang="zh-Hans"
      >
        {{ brand.subtitle }}
      </span>
    </span>
  </NuxtLinkLocale>
</template>

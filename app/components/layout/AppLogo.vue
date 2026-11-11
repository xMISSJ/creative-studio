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
  >
    <span
      class="truncate font-logo text-3xl tracking-tight text-ink italic sm:text-[2.15rem]"
      translate="no"
    >
      {{ brand.name }}
    </span>
    <span
      class="pointer-events-none absolute top-0 end-0 size-2.5 translate-x-1 -translate-y-0.5 rounded-full bg-accent"
      aria-hidden="true"
    />
  </NuxtLinkLocale>
</template>

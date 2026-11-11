<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  lead?: string
}>()
</script>

<template>
  <header class="max-w-3xl">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h1 class="mt-3 max-w-3xl font-display text-[2rem] leading-[1.08] font-bold sm:text-5xl">{{ title }}</h1>
    <p v-if="lead" class="mt-4 max-w-2xl text-base leading-relaxed text-current/75 sm:text-lg">{{ lead }}</p>
  </header>
</template>

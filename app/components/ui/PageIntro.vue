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
    <h1 class="mt-3 max-w-3xl font-display text-4xl leading-[1.08] font-bold sm:text-5xl">{{ title }}</h1>
    <p v-if="lead" class="mt-4 max-w-2xl text-lg leading-relaxed text-current/75">{{ lead }}</p>
  </header>
</template>

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
    <h1 class="display-title mt-3 max-w-3xl text-[2rem] sm:text-5xl">{{ title }}</h1>
    <p v-if="lead" class="mt-4 max-w-2xl text-base leading-relaxed text-current/75 sm:text-lg">{{ lead }}</p>
  </header>
</template>

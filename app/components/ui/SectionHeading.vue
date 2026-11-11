<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  lead?: string
}>()
</script>

<template>
  <div class="max-w-2xl">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h2 class="mt-2 font-display text-4xl leading-tight sm:text-5xl">{{ title }}</h2>
    <p v-if="lead" class="mt-3 text-lg text-muted">{{ lead }}</p>
  </div>
</template>

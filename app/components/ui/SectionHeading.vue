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
    <h2 class="display-title mt-2 text-4xl sm:text-5xl">{{ title }}</h2>
    <p v-if="lead" class="mt-3 text-lg text-muted">{{ lead }}</p>
  </div>
</template>

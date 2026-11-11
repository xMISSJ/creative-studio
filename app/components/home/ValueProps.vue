<script setup lang="ts">
const { t, tm, text } = useShopI18n()

const items = computed(() => {
  const value = tm('home.values')
  if (!Array.isArray(value)) return []
  return value.map((entry) => {
    const row = entry as { title?: unknown; body?: unknown }
    return {
      title: text(row.title),
      body: text(row.body),
    }
  }).filter((entry) => entry.title)
})
</script>

<template>
  <section class="container-page py-10 sm:py-12">
    <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <article v-for="item in items" :key="item.title" class="value-card">
        <h3 class="font-display text-xl font-bold lowercase text-ink">{{ item.title }}</h3>
        <p class="mt-2 text-sm text-muted">{{ item.body }}</p>
      </article>
    </div>
  </section>
</template>

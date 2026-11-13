<script setup lang="ts">
const props = defineProps<{
  eyebrow?: string
  title: string
  lead?: string
}>()

/** Hide when the eyebrow repeats the title (exact, word prefix, or CJK prefix). */
const showEyebrow = computed(() => {
  const raw = props.eyebrow?.trim()
  if (!raw) return false
  const eyebrow = raw.toLocaleLowerCase()
  const title = props.title.trim().toLocaleLowerCase()
  if (eyebrow === title) return false
  if (title.startsWith(`${eyebrow} `)) return false
  if (/[\u3000-\u9fff\uac00-\ud7af]/.test(raw) && title.startsWith(eyebrow) && title.length > eyebrow.length) {
    return false
  }
  return true
})
</script>

<template>
  <div class="max-w-2xl">
    <p v-if="showEyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h2
      class="display-title text-4xl sm:text-5xl"
      :class="showEyebrow ? 'mt-2' : undefined"
    >
      {{ title }}
    </h2>
    <p v-if="lead" class="mt-3 text-lg text-muted">{{ lead }}</p>
  </div>
</template>

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
  <header class="max-w-3xl">
    <p v-if="showEyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h1
      class="display-title max-w-3xl text-[2rem] sm:text-5xl"
      :class="showEyebrow ? 'mt-3' : undefined"
    >
      {{ title }}
    </h1>
    <p v-if="lead" class="mt-4 max-w-2xl text-base leading-relaxed text-current/75 sm:text-lg">{{ lead }}</p>
  </header>
</template>

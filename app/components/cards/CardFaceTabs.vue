<script setup lang="ts">
import type { CardSession } from '#shared/card-editor'

const props = defineProps<{
  sessions: readonly CardSession[]
  modelValue: CardSession
}>()

const emit = defineEmits<{
  'update:modelValue': [session: CardSession]
}>()

const { t } = useShopI18n()

const activeIndex = computed(() =>
  Math.max(0, props.sessions.findIndex((session) => session === props.modelValue)),
)

const columns = computed(() => props.sessions.length)
</script>

<template>
  <div
    v-if="sessions.length > 1"
    class="card-face-tabs relative grid w-full list-none gap-1 rounded-full border border-line bg-paper p-1"
    role="tablist"
    :aria-label="t('cards.sessionsTitle')"
    :style="{
      '--tab-index': activeIndex,
      '--tab-count': columns,
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    }"
  >
    <span class="card-face-tab-pill" aria-hidden="true" />
    <button
      v-for="session in sessions"
      :id="`card-session-tab-${session}`"
      :key="session"
      type="button"
      role="tab"
      class="card-face-tab relative z-10 flex min-h-11 items-center justify-center rounded-full px-2 text-center text-sm font-bold sm:px-3"
      :class="modelValue === session ? 'text-[var(--on-button)]' : 'text-muted hover:text-ink'"
      :aria-selected="modelValue === session"
      :tabindex="modelValue === session ? 0 : -1"
      @click="emit('update:modelValue', session)"
    >
      {{ t(`cards.sessions.${session}`) }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { cardTextColors, defaultTextFontSize, type CardElement, type CardTextColor } from '#shared/card-editor'

const props = defineProps<{
  element: CardElement | null
}>()

const emit = defineEmits<{
  update: [patch: Partial<CardElement>]
  remove: []
}>()

const { t } = useShopI18n()

const textValue = computed({
  get: () => props.element?.text ?? '',
  set: (value: string) => emit('update', { text: value }),
})

const fontSizeValue = computed({
  get: () => props.element?.fontSize ?? defaultTextFontSize,
  set: (value: number) => {
    const fontSize = Math.min(22, Math.max(4, value))
    const h = Math.max(props.element?.h ?? 16, Math.min(42, Math.round(fontSize * 1.6)))
    emit('update', { fontSize, h })
  },
})

const sizeValue = computed({
  get: () => props.element?.w ?? 20,
  set: (value: number) => {
    if (!props.element || props.element.kind === 'text') return
    const ratio = props.element.h / props.element.w || 1
    const w = Math.min(90, Math.max(8, value))
    emit('update', { w, h: Math.min(90, Math.max(8, w * ratio)) })
  },
})

const rotateValue = computed({
  get: () => props.element?.rotation ?? 0,
  set: (value: number) => emit('update', { rotation: value }),
})
</script>

<template>
  <aside
    v-if="element"
    class="card-inspector"
    :aria-label="t('cards.propertiesTitle')"
  >
    <div class="flex items-center justify-between gap-2">
      <h2 class="card-setup-label !mb-0">
        {{ element.kind === 'text' ? t('cards.selectionText') : t('cards.selectionSticker') }}
      </h2>
      <button type="button" class="link link-hit text-sm" @click="emit('remove')">
        {{ t('cards.remove') }}
      </button>
    </div>

    <div v-if="element.kind === 'text'" class="mt-3 flex flex-col gap-3">
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-bold" for="card-text-input">{{ t('cards.textLabel') }}</label>
        <textarea
          id="card-text-input"
          v-model="textValue"
          class="field min-h-20 rounded-md"
          rows="2"
          maxlength="120"
        />
      </div>

      <div>
        <p class="text-sm font-bold">{{ t('cards.textColorLabel') }}</p>
        <div class="mt-1.5 flex flex-wrap gap-1">
          <button
            v-for="color in cardTextColors"
            :key="color"
            type="button"
            class="chip"
            :aria-current="(element.color ?? 'ink') === color ? 'true' : undefined"
            @click="emit('update', { color: color as CardTextColor })"
          >
            {{ t(`cards.textColors.${color}`) }}
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-bold" for="card-font-size-range">{{ t('cards.textSizeLabel') }}</label>
        <input
          id="card-font-size-range"
          v-model.number="fontSizeValue"
          class="w-full accent-[var(--accent)]"
          type="range"
          min="4"
          max="22"
          step="1"
        >
      </div>
    </div>

    <div v-else class="mt-3 flex flex-col gap-1.5">
      <label class="text-sm font-bold" for="card-size-range">{{ t('cards.sizeLabel') }}</label>
      <input
        id="card-size-range"
        v-model.number="sizeValue"
        class="w-full accent-[var(--accent)]"
        type="range"
        min="8"
        max="80"
        step="1"
      >
    </div>

    <div class="mt-3 flex flex-col gap-1.5">
      <label class="text-sm font-bold" for="card-rotate-range">{{ t('cards.rotateLabel') }}</label>
      <input
        id="card-rotate-range"
        v-model.number="rotateValue"
        class="w-full accent-[var(--accent)]"
        type="range"
        min="-180"
        max="180"
        step="1"
      >
    </div>
  </aside>
</template>

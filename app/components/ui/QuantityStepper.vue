<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: number
  min?: number
  max?: number
  title: string
}>(), {
  min: 1,
  max: 99,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const { t } = useShopI18n()

function update(next: number) {
  emit('update:modelValue', Math.min(props.max, Math.max(props.min, next)))
}
</script>

<template>
  <div class="inline-flex items-center rounded-full border border-line bg-paper">
    <button
      type="button"
      class="icon-btn"
      :aria-label="t('product.decrease', { title })"
      :disabled="modelValue <= min"
      @click="update(modelValue - 1)"
    >
      −
    </button>
    <span class="min-w-8 text-center font-bold" aria-live="polite">
      <span class="sr-only">{{ t('product.quantity', { title }) }}</span>
      {{ modelValue }}
    </span>
    <button
      type="button"
      class="icon-btn"
      :aria-label="t('product.increase', { title })"
      :disabled="modelValue >= max"
      @click="update(modelValue + 1)"
    >
      +
    </button>
  </div>
</template>

<script setup lang="ts">
import { customCardPriceCents } from '#shared/card-editor'

defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  add: []
}>()

const { t } = useShopI18n()
const format = useFormatPrice()
</script>

<template>
  <div class="card-studio-cart">
    <div class="min-w-0">
      <p class="text-lg font-extrabold text-ink">{{ format(customCardPriceCents) }}</p>
      <p class="mt-0.5 text-sm leading-snug text-muted">{{ t('cards.printingLater') }}</p>
    </div>
    <button
      type="button"
      class="btn btn-primary shrink-0"
      :disabled="disabled"
      @click="emit('add')"
    >
      {{ t('cards.addToCart') }}
    </button>
  </div>
</template>

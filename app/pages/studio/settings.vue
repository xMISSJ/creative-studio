<script setup lang="ts">
definePageMeta({
  layout: 'studio',
  middleware: 'admin',
})

defineI18nRoute(false)

const { t } = useShopI18n()
usePageMeta('meta.studioSettingsTitle', 'meta.studioSettingsDescription', { robots: 'noindex, nofollow' })

const { data, refresh } = await useFetch('/api/admin/catalog', { key: 'admin-catalog' })

const cardPrice = ref('')
const pending = ref(false)
const messageKey = ref<'none' | 'saved' | 'failed' | 'auth'>('none')

watch(() => data.value?.settings?.customCardPriceCents, (cents) => {
  if (typeof cents === 'number') cardPrice.value = (cents / 100).toFixed(2)
}, { immediate: true })

async function save() {
  pending.value = true
  messageKey.value = 'none'
  const cents = Math.round(Number(String(cardPrice.value).replace(',', '.')) * 100)
  if (!Number.isFinite(cents) || cents < 0) {
    messageKey.value = 'failed'
    pending.value = false
    return
  }
  try {
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: { customCardPriceCents: cents },
    })
    await refresh()
    messageKey.value = 'saved'
  } catch (error: unknown) {
    const status = typeof error === 'object' && error && 'statusCode' in error
      ? Number((error as { statusCode?: number }).statusCode)
      : 0
    messageKey.value = status === 401 ? 'auth' : 'failed'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <section class="max-w-lg">
    <h1 class="display-title text-3xl">{{ t('studio.settingsTitle') }}</h1>
    <p class="mt-2 text-sm text-muted">{{ t('studio.settingsLead') }}</p>

    <form class="mt-8 space-y-4 rounded-md border border-line bg-paper p-5" @submit.prevent="save">
      <div>
        <label class="text-sm font-bold" for="studio-card-price">{{ t('studio.field.cardPrice') }}</label>
        <input
          id="studio-card-price"
          v-model="cardPrice"
          class="mt-1 w-full rounded-md border border-line bg-canvas px-3 py-3"
          type="number"
          min="0"
          step="0.01"
        >
        <p class="mt-2 text-xs text-muted">{{ t('studio.field.cardPriceHint') }}</p>
      </div>

      <p v-if="messageKey === 'saved'" class="text-sm text-muted" role="status">{{ t('studio.saved') }}</p>
      <p v-else-if="messageKey === 'auth'" class="text-sm text-accent" role="alert">{{ t('studio.saveAuth') }}</p>
      <p v-else-if="messageKey === 'failed'" class="text-sm text-accent" role="alert">{{ t('studio.saveFailed') }}</p>

      <button type="submit" class="btn btn-primary" :disabled="pending">
        {{ pending ? t('studio.saving') : t('studio.save') }}
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import type { CatalogItem } from '#shared/catalog'

definePageMeta({
  layout: 'studio',
  middleware: 'admin',
})

defineI18nRoute(false)

const { t } = useShopI18n()
const format = useFormatPrice()
usePageMeta('meta.studioProductsTitle', 'meta.studioProductsDescription', { robots: 'noindex, nofollow' })

const { data, status, error, refresh } = await useFetch<{ items: CatalogItem[] }>('/api/admin/catalog', {
  key: 'admin-catalog',
})

const savingSlug = ref<string | null>(null)
const saveError = ref(false)

async function savePrice(item: CatalogItem, raw: string) {
  const euros = Number(raw.replace(',', '.'))
  if (!Number.isFinite(euros) || euros < 0) {
    saveError.value = true
    return
  }
  savingSlug.value = item.slug
  saveError.value = false
  try {
    await $fetch(`/api/admin/catalog/${item.slug}`, {
      method: 'PUT',
      body: { price: Math.round(euros * 100) },
    })
    await refresh()
  } catch {
    saveError.value = true
  } finally {
    savingSlug.value = null
  }
}

async function saveStock(item: CatalogItem, raw: string) {
  const stock = Number(raw)
  if (!Number.isFinite(stock) || stock < 0) {
    saveError.value = true
    return
  }
  savingSlug.value = item.slug
  saveError.value = false
  try {
    await $fetch(`/api/admin/catalog/${item.slug}`, {
      method: 'PUT',
      body: { stock: Math.round(stock) },
    })
    await refresh()
  } catch {
    saveError.value = true
  } finally {
    savingSlug.value = null
  }
}
</script>

<template>
  <section>
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="display-title text-3xl">{{ t('studio.productsTitle') }}</h1>
        <p class="mt-2 text-sm text-muted">{{ t('studio.productsLead') }}</p>
      </div>
      <button type="button" class="btn btn-ghost" @click="refresh()">
        {{ t('studio.refresh') }}
      </button>
    </div>

    <p v-if="saveError" class="mt-4 text-sm text-accent" role="alert">{{ t('studio.saveFailed') }}</p>
    <p v-else-if="status === 'pending'" class="mt-4 text-sm text-muted">{{ t('studio.loading') }}</p>
    <p v-else-if="error" class="mt-4 text-sm text-accent" role="alert">{{ t('studio.loadFailed') }}</p>

    <div v-else class="mt-6 overflow-x-auto rounded-md border border-line bg-paper">
      <table class="w-full min-w-[40rem] text-left text-sm">
        <thead class="border-b border-line text-xs tracking-wide text-muted uppercase">
          <tr>
            <th class="px-4 py-3 font-bold">{{ t('studio.col.product') }}</th>
            <th class="px-4 py-3 font-bold">{{ t('studio.col.price') }}</th>
            <th class="px-4 py-3 font-bold">{{ t('studio.col.stock') }}</th>
            <th class="px-4 py-3 font-bold">{{ t('studio.col.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in data?.items || []"
            :key="item.slug"
            class="border-b border-line last:border-0"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img
                  :src="item.image"
                  alt=""
                  class="size-12 rounded-md object-cover"
                  width="48"
                  height="48"
                >
                <div class="min-w-0">
                  <p class="font-bold">{{ t(`products.${item.slug}.title`) }}</p>
                  <p class="text-xs text-muted">{{ item.slug }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <label class="sr-only" :for="`price-${item.slug}`">{{ t('studio.col.price') }}</label>
              <div class="flex items-center gap-2">
                <input
                  :id="`price-${item.slug}`"
                  class="w-24 rounded-md border border-line bg-canvas px-2 py-2"
                  type="number"
                  min="0"
                  step="0.01"
                  :value="(item.price / 100).toFixed(2)"
                  :disabled="savingSlug === item.slug"
                  @change="savePrice(item, ($event.target as HTMLInputElement).value)"
                >
                <span class="text-muted">{{ format(item.price) }}</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <label class="sr-only" :for="`stock-${item.slug}`">{{ t('studio.col.stock') }}</label>
              <input
                :id="`stock-${item.slug}`"
                class="w-20 rounded-md border border-line bg-canvas px-2 py-2"
                type="number"
                min="0"
                step="1"
                :value="item.stock"
                :disabled="savingSlug === item.slug"
                @change="saveStock(item, ($event.target as HTMLInputElement).value)"
              >
            </td>
            <td class="px-4 py-3">
              <NuxtLink :to="`/studio/products/${item.slug}`" class="font-bold text-accent">
                {{ t('studio.edit') }}
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

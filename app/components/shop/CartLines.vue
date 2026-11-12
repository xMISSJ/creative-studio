<script setup lang="ts">
const { t } = useShopI18n()
const format = useFormatPrice()
const { items, notice, hydrated, setQty, remove } = useCart()
const { data } = await useCatalog()

const lines = computed(() =>
  items.value.map((line) => ({
    ...line,
    item: data.value?.items.find((entry) => entry.slug === line.slug),
  })),
)

const subtotal = computed(() =>
  lines.value.reduce((sum, line) => {
    if (!line.item || line.item.stock <= 0) return sum
    return sum + line.item.price * Math.min(line.qty, line.item.stock)
  }, 0),
)

watch(data, (payload) => {
  if (!payload) return
  for (const line of items.value) {
    const item = payload.items.find((entry) => entry.slug === line.slug)
    if (item && line.qty > item.stock) setQty(line.slug, item.stock, item.stock)
  }
})
</script>

<template>
  <div>
    <p v-if="notice" class="mb-4 text-sm font-bold" role="status">
      {{ notice.type === 'added' ? t('product.added') : t('product.limit') }}
    </p>
    <p v-if="!hydrated" class="text-muted">{{ t('shop.loading') }}</p>
    <p v-else-if="!lines.length" class="text-muted">{{ t('cart.empty') }}</p>
    <ul v-else-if="lines.length" class="divide-y divide-line">
      <li v-for="line in lines" :key="line.slug" class="flex gap-3 py-4">
        <img
          v-if="line.item"
          :src="line.item.image"
          alt=""
          width="96"
          height="120"
          class="size-20 rounded-md object-cover sm:size-24"
        >
        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-3">
            <h3 class="font-display text-2xl leading-tight">
              <NuxtLinkLocale v-if="line.item" class="rounded-md" :to="`/shop/${line.slug}`">
                {{ t(`products.${line.slug}.title`) }}
              </NuxtLinkLocale>
              <span v-else>{{ t('cart.missing') }}</span>
            </h3>
            <p v-if="line.item" class="shrink-0 font-extrabold">
              {{ format(line.item.price * Math.min(line.qty, Math.max(line.item.stock, 0))) }}
            </p>
          </div>
          <p v-if="line.item && line.item.stock <= 0" class="mt-1 text-sm text-warn">{{ t('product.soldOut') }}</p>
          <p v-else-if="!line.item" class="mt-1 text-sm text-muted">{{ t('cart.missing') }}</p>
          <div class="mt-3 flex flex-wrap items-center gap-3">
            <QuantityStepper
              v-if="line.item && line.item.stock > 0"
              :model-value="line.qty"
              :max="line.item.stock"
              :title="t(`products.${line.slug}.title`)"
              @update:model-value="setQty(line.slug, $event, line.item?.stock ?? 0)"
            />
            <button type="button" class="link" @click="remove(line.slug)">{{ t('cart.remove') }}</button>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="lines.length" class="mt-6 border-t border-line pt-4">
      <p class="flex items-center justify-between gap-3 text-lg font-extrabold">
        <span>{{ t('cart.subtotal') }}</span>
        <span>{{ format(subtotal) }}</span>
      </p>
      <p class="mt-1 text-sm text-muted">{{ t('cart.shippingNote') }}</p>
    </div>
  </div>
</template>

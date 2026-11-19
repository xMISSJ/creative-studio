<script setup lang="ts">
import { cardAssetById } from '#shared/card-editor'
import type { CustomCardCartLine, ProductCartLine } from '#shared/catalog'

const { t } = useShopI18n()
const format = useFormatPrice()
const { items, notice, hydrated, setQty, setCustomQty, removeProduct, removeCustom } = useCart()
const { data } = await useCatalog()
const baseURL = useRuntimeConfig().app.baseURL || '/'

const productLines = computed(() =>
  items.value
    .filter((line): line is ProductCartLine => line.kind === 'product')
    .map((line) => ({
      ...line,
      item: data.value?.items.find((entry) => entry.slug === line.slug),
    })),
)

const customLines = computed(() =>
  items.value.filter((line): line is CustomCardCartLine => line.kind === 'custom-card'),
)

const hasLines = computed(() => productLines.value.length > 0 || customLines.value.length > 0)

const subtotal = computed(() => {
  let sum = 0
  for (const line of productLines.value) {
    if (!line.item || line.item.stock <= 0) continue
    sum += line.item.price * Math.min(line.qty, line.item.stock)
  }
  for (const line of customLines.value) {
    sum += line.price * line.qty
  }
  return sum
})

const noticeText = computed(() => {
  if (!notice.value) return ''
  if (notice.value.kind === 'custom-card') {
    return notice.value.type === 'added' ? t('cards.added') : t('product.limit')
  }
  return notice.value.type === 'added' ? t('product.added') : t('product.limit')
})

watch(data, (payload) => {
  if (!payload) return
  for (const line of items.value) {
    if (line.kind !== 'product') continue
    const item = payload.items.find((entry) => entry.slug === line.slug)
    if (item && line.qty > item.stock) setQty(line.slug, item.stock, item.stock)
  }
})

function customTitle(line: CustomCardCartLine) {
  return t('cards.cartTitle', {
    format: t(`cards.formatsShort.${line.design.format}`),
    size: t(`cards.sizes.${line.design.size}`),
  })
}

function customThumb(line: CustomCardCartLine) {
  const assetId = line.design.faces.front.elements.find((el) => el.kind === 'sticker')?.assetId
    ?? line.design.faces.front.backgroundAssetId
  const asset = cardAssetById(assetId)
  return asset ? publicAsset(asset.src, baseURL) : null
}
</script>

<template>
  <div>
    <p v-if="noticeText" class="mb-4 text-sm font-bold" role="status">
      {{ noticeText }}
    </p>
    <p v-if="!hydrated" class="text-muted">{{ t('shop.loading') }}</p>
    <p v-else-if="!hasLines" class="text-muted">{{ t('cart.empty') }}</p>
    <ul v-else class="divide-y divide-line">
      <li v-for="line in productLines" :key="`product-${line.slug}`" class="flex gap-3 py-4">
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
            <button type="button" class="link link-hit" @click="removeProduct(line.slug)">{{ t('cart.remove') }}</button>
          </div>
        </div>
      </li>

      <li v-for="line in customLines" :key="`card-${line.id}`" class="flex gap-3 py-4">
        <div class="grid size-20 place-items-center rounded-md border border-line bg-[color-mix(in_srgb,var(--lilac-mist)_70%,var(--paper))] sm:size-24">
          <img
            v-if="customThumb(line)"
            :src="customThumb(line)!"
            alt=""
            width="64"
            height="64"
            class="size-12 object-contain"
            decoding="async"
          >
          <span v-else class="font-display text-lg text-muted" aria-hidden="true">✦</span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h3 class="font-display text-2xl leading-tight">
                {{ customTitle(line) }}
              </h3>
              <p class="mt-1 text-sm text-muted">
                {{ t('cards.cartSummary', { paper: t(`cards.papers.${line.design.paper}`) }) }}
              </p>
            </div>
            <p class="shrink-0 font-extrabold">
              {{ format(line.price * line.qty) }}
            </p>
          </div>
          <div class="mt-3 flex flex-wrap items-center gap-3">
            <QuantityStepper
              :model-value="line.qty"
              :max="99"
              :title="customTitle(line)"
              @update:model-value="setCustomQty(line.id, $event)"
            />
            <button type="button" class="link link-hit" @click="removeCustom(line.id)">{{ t('cart.remove') }}</button>
            <NuxtLinkLocale class="link link-hit" to="/cards">{{ t('cards.editAgain') }}</NuxtLinkLocale>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="hasLines" class="mt-6 border-t border-line pt-4">
      <p class="flex items-center justify-between gap-3 text-lg font-extrabold">
        <span>{{ t('cart.subtotal') }}</span>
        <span>{{ format(subtotal) }}</span>
      </p>
      <p class="mt-1 text-sm text-muted">{{ t('cart.shippingNote') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPageTitle } from '~~/site.config'

const route = useRoute()
const { t, tm, text, locale, brand } = useShopI18n()
const format = useFormatPrice()
const cart = useCart()
const { data } = await useCatalog()

const slug = computed(() => String(route.params.slug))
const item = computed(() => data.value?.items.find((entry) => entry.slug === slug.value))
const qty = ref(1)

const inCart = computed(() => cart.items.value.find((line) => line.slug === slug.value)?.qty ?? 0)
const remaining = computed(() => Math.max(0, (item.value?.stock ?? 0) - inCart.value))

watch(item, () => {
  qty.value = 1
})

watch(remaining, (value) => {
  if (value > 0 && qty.value > value) qty.value = value
})

const details = computed(() => {
  void locale.value
  if (!item.value) return []
  const value = tm(`products.${item.value.slug}.details`)
  return Array.isArray(value) ? value.map((entry) => text(entry)).filter(Boolean) : []
})

const related = computed(() => {
  const current = item.value
  if (!current || !data.value) return []
  const others = data.value.items.filter((entry) => entry.slug !== current.slug)
  const same = others.filter((entry) => entry.collection === current.collection)
  const rest = others.filter((entry) => entry.collection !== current.collection)
  return [...same, ...rest].slice(0, 3)
})

const stockMessage = computed(() => {
  if (!item.value) return ''
  if (item.value.stock <= 0) return t('product.soldOut')
  if (remaining.value <= 0) return t('product.inCart')
  if (item.value.stock <= brand.lowStockAt) return t('product.lowStock', { count: item.value.stock })
  return t('product.inStock')
})

const feedback = computed(() => {
  if (!item.value || cart.notice.value?.slug !== item.value.slug) return ''
  return cart.notice.value.type === 'added' ? t('product.added') : t('product.limit')
})

const pageTitle = computed(() => (item.value ? t(`products.${item.value.slug}.title`) : t('product.missingTitle')))

useSeoMeta({
  title: () => pageTitle.value,
  ogTitle: () => formatPageTitle(pageTitle.value),
  description: () => (item.value ? t(`products.${item.value.slug}.summary`) : t('product.missingBody')),
  ogDescription: () => (item.value ? t(`products.${item.value.slug}.summary`) : t('product.missingBody')),
  robots: () => (item.value ? undefined : 'noindex'),
})

function add() {
  if (!item.value) return
  cart.add(item.value.slug, qty.value, item.value.stock)
}
</script>

<template>
  <section class="container-page py-10">
    <nav :aria-label="t('nav.breadcrumb')">
      <ol class="flex flex-wrap items-center gap-2 text-sm text-muted">
        <li><NuxtLinkLocale class="link" to="/">{{ t('nav.home') }}</NuxtLinkLocale></li>
        <li aria-hidden="true">/</li>
        <li><NuxtLinkLocale class="link" to="/shop">{{ t('nav.shop') }}</NuxtLinkLocale></li>
        <li v-if="item" aria-hidden="true">/</li>
        <li v-if="item" aria-current="page">{{ t(`products.${item.slug}.title`) }}</li>
      </ol>
    </nav>

    <div v-if="!item" class="py-12">
      <PageIntro :title="t('product.missingTitle')" :lead="t('product.missingBody')" />
      <NuxtLinkLocale class="btn btn-primary mt-8" to="/shop">{{ t('nav.shop') }}</NuxtLinkLocale>
    </div>

    <div v-else class="mt-8 grid items-start gap-8 lg:grid-cols-2">
      <div class="mat">
        <img
          :src="item.image"
          :alt="t(`products.${item.slug}.alt`)"
          width="800"
          height="1000"
          class="aspect-square w-full rounded-[1.2rem] object-cover"
          fetchpriority="high"
        >
      </div>
      <div>
        <p v-if="item.badge" class="eyebrow">{{ t(`badges.${item.badge}`) }}</p>
        <h1 class="mt-2 font-display text-5xl leading-tight">{{ t(`products.${item.slug}.title`) }}</h1>
        <p class="mt-3 text-2xl font-extrabold">{{ format(item.price) }}</p>
        <p class="mt-4 text-lg text-muted">{{ t(`products.${item.slug}.description`) }}</p>
        <p class="mt-4">
          <NuxtLinkLocale class="link" :to="{ path: '/shop', query: { type: 'coloring-books', theme: item.collection } }">{{ t(`collections.${item.collection}.title`) }}</NuxtLinkLocale>
        </p>
        <p class="mt-4 font-bold" :class="item.stock <= brand.lowStockAt ? 'text-warn' : 'text-muted'">{{ stockMessage }}</p>

        <div class="mt-6 flex flex-wrap items-center gap-3">
          <QuantityStepper v-model="qty" :max="Math.max(remaining, 1)" :title="t(`products.${item.slug}.title`)" />
          <button type="button" class="btn btn-primary" :disabled="remaining <= 0" @click="add">
            {{ t('product.add') }}
          </button>
        </div>
        <p class="mt-3 min-h-6 text-sm font-bold" role="status">{{ feedback }}</p>
        <p class="mt-2 text-sm text-muted">{{ t('product.shipping') }}</p>

        <h2 class="mt-8 font-display text-2xl">{{ t('product.details') }}</h2>
        <ul class="mt-3 list-disc space-y-1 ps-5 text-muted">
          <li v-for="detail in details" :key="detail">{{ detail }}</li>
        </ul>
      </div>
    </div>

    <div v-if="related.length" class="mt-16">
      <h2 class="font-display text-4xl">{{ t('product.related') }}</h2>
      <ProductGrid class="mt-6" :items="related" />
    </div>
  </section>
</template>

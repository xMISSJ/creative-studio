<script setup lang="ts">
import type { CollectionSlug } from '#shared/catalog'

const route = useRoute()
const router = useRouter()
const { t, locale } = useShopI18n()
usePageMeta('meta.shopTitle', 'meta.shopDescription')

const { data, status, error, refresh } = await useCatalog()
const search = ref(typeof route.query.q === 'string' ? route.query.q : '')

watch(() => route.query.q, (value) => {
  const next = typeof value === 'string' ? value : ''
  if (next !== search.value) search.value = next
})

let timer: ReturnType<typeof setTimeout> | undefined

watch(search, (value) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    const q = value.trim()
    const current = typeof route.query.q === 'string' ? route.query.q : ''
    if (q === current) return
    const query = { ...route.query }
    if (q) query.q = q
    else delete query.q
    router.replace({ query })
  }, 180)
})

onBeforeUnmount(() => clearTimeout(timer))

const activeCollection = computed(() => {
  const value = route.query.collection
  if (typeof value !== 'string') return 'all'
  return data.value?.collections.includes(value as CollectionSlug) ? value : 'all'
})

const sort = computed(() => {
  const value = route.query.sort
  if (value === 'price-asc' || value === 'price-desc' || value === 'title') return value
  return 'featured'
})

const filtered = computed(() => {
  const q = search.value.trim().toLocaleLowerCase(locale.value)
  const next = (data.value?.items ?? []).filter((item) => {
    if (activeCollection.value !== 'all' && item.collection !== activeCollection.value) return false
    if (!q) return true
    const title = t(`products.${item.slug}.title`).toLocaleLowerCase(locale.value)
    const summary = t(`products.${item.slug}.summary`).toLocaleLowerCase(locale.value)
    return title.includes(q) || summary.includes(q)
  })

  if (sort.value === 'price-asc') next.sort((a, b) => a.price - b.price)
  else if (sort.value === 'price-desc') next.sort((a, b) => b.price - a.price)
  else if (sort.value === 'title') {
    next.sort((a, b) => t(`products.${a.slug}.title`).localeCompare(t(`products.${b.slug}.title`), locale.value))
  } else {
    next.sort((a, b) => a.sort - b.sort)
  }

  return next
})

function shopLink(collection?: string) {
  const query: Record<string, string> = {}
  if (typeof route.query.q === 'string' && route.query.q) query.q = route.query.q
  if (typeof route.query.sort === 'string' && route.query.sort) query.sort = route.query.sort
  if (collection) query.collection = collection
  return { path: '/shop', query }
}

function onSort(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  const query = { ...route.query }
  if (value === 'featured') delete query.sort
  else query.sort = value
  router.replace({ query })
}
</script>

<template>
  <section class="container-page py-12">
    <PageIntro :eyebrow="t('nav.shop')" :title="t('meta.shopTitle')" :lead="t('shop.lead')" />

    <div class="mt-8 grid gap-4 lg:grid-cols-[1fr_16rem]">
      <div>
        <label class="mb-2 block font-bold" for="shop-search">{{ t('shop.searchLabel') }}</label>
        <input id="shop-search" v-model="search" class="field" type="search" name="q" :placeholder="t('shop.searchPlaceholder')">
      </div>
      <div>
        <label class="mb-2 block font-bold" for="shop-sort">{{ t('shop.sortLabel') }}</label>
        <select id="shop-sort" class="field" :value="sort" @change="onSort">
          <option value="featured">{{ t('shop.sortFeatured') }}</option>
          <option value="price-asc">{{ t('shop.sortPriceAsc') }}</option>
          <option value="price-desc">{{ t('shop.sortPriceDesc') }}</option>
          <option value="title">{{ t('shop.sortTitle') }}</option>
        </select>
      </div>
    </div>

    <ul class="mt-5 flex list-none gap-2 overflow-x-auto pb-2">
      <li>
        <NuxtLinkLocale class="chip shrink-0" :to="shopLink()" :aria-current="activeCollection === 'all' ? 'true' : undefined">
          {{ t('shop.all') }}
        </NuxtLinkLocale>
      </li>
      <li v-for="collection in data?.collections ?? []" :key="collection">
        <NuxtLinkLocale
          class="chip shrink-0"
          :to="shopLink(collection)"
          :aria-current="activeCollection === collection ? 'true' : undefined"
        >
          {{ t(`collections.${collection}.title`) }}
        </NuxtLinkLocale>
      </li>
    </ul>

    <p class="mt-6 text-sm font-bold text-muted" aria-live="polite">{{ t('shop.resultCount', { count: filtered.length }) }}</p>

    <p v-if="error" class="mt-8" role="alert">
      {{ t('shop.loadError') }}
      <button type="button" class="link ms-2" @click="refresh()">{{ t('shop.retry') }}</button>
    </p>
    <p v-else-if="status === 'pending'" class="mt-8 text-muted">{{ t('shop.loading') }}</p>
    <p v-else-if="!filtered.length" class="mt-8 max-w-xl text-muted">{{ t('shop.empty') }}</p>
    <ProductGrid v-else class="mt-8" :items="filtered" />
  </section>
</template>

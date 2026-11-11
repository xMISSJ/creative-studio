<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { t, locale } = useShopI18n()
usePageMeta('meta.shopTitle', 'meta.shopDescription')

const { data, status, error, refresh } = await useCatalog()
const {
  activeType,
  activeTheme,
  activeDigitalCategory,
  showingColoringBooks,
  showingDigitalArt,
  showingComingSoon,
  shopHomeLink,
  shopLink,
} = useShopBrowse()

const search = ref(typeof route.query.q === 'string' ? route.query.q : '')
const items = computed(() => data.value?.items ?? [])

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

const sort = computed(() => {
  const value = route.query.sort
  if (value === 'price-asc' || value === 'price-desc' || value === 'title') return value
  return 'featured'
})

const filtered = computed(() => {
  if (!showingColoringBooks.value || !activeType.value) return []
  const q = search.value.trim().toLocaleLowerCase(locale.value)
  const next = items.value.filter((item) => {
    if (item.type !== activeType.value) return false
    if (activeTheme.value !== 'all' && item.collection !== activeTheme.value) return false
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

const pageTitle = computed(() => {
  if (!activeType.value) return t('meta.shopTitle')
  if (showingColoringBooks.value && activeTheme.value !== 'all') {
    return t(`collections.${activeTheme.value}.title`)
  }
  if (showingDigitalArt.value) {
    return t(`digitalArt.categories.${activeDigitalCategory.value}.title`)
  }
  return t(`productTypes.${activeType.value}.title`)
})

const pageLead = computed(() => {
  if (!activeType.value) return t('shop.lead')
  if (showingDigitalArt.value) {
    return t(`digitalArt.categories.${activeDigitalCategory.value}.summary`)
  }
  if (showingComingSoon.value) return t('shop.comingSoonLead')
  if (showingColoringBooks.value && activeTheme.value !== 'all') {
    return t(`collections.${activeTheme.value}.summary`)
  }
  return t('shop.coloringLead')
})

function onSort(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  const query = { ...route.query }
  if (value === 'featured') delete query.sort
  else query.sort = value
  router.replace({ query })
}
</script>

<template>
  <div>
    <template v-if="showingDigitalArt">
      <section class="bg-lilac text-on-soft">
        <div class="container-page grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div class="rise">
            <PageIntro :eyebrow="t('nav.shop')" :title="pageTitle" :lead="pageLead" />
            <div class="mt-8 flex flex-wrap gap-3">
              <NuxtLinkLocale class="btn btn-primary" :to="shopLink({ type: 'coloring-books' })">
                {{ t('shop.digitalArt.cta') }}
              </NuxtLinkLocale>
              <NuxtLinkLocale class="btn btn-ghost border-on-soft/25 text-on-soft" :to="shopHomeLink()">
                {{ t('shop.back') }}
              </NuxtLinkLocale>
            </div>
          </div>
          <div class="rise delay-1 flex items-end justify-center self-end">
            <img
              src="/art/shiba_alpaca.png"
              :alt="t('shop.digitalArt.bannerAlt')"
              width="1177"
              height="713"
              class="w-full max-w-xl origin-bottom object-contain drop-shadow-[0_18px_28px_rgba(58,51,72,0.18)]"
              fetchpriority="high"
              decoding="async"
            >
          </div>
        </div>
      </section>

      <section class="container-page py-12">
        <ShopDigitalArt />
      </section>
    </template>

    <section v-else class="container-page py-12">
      <PageIntro :eyebrow="t('nav.shop')" :title="pageTitle" :lead="pageLead" />

      <template v-if="!activeType">
        <ShopTypePicker class="mt-10" />
      </template>

      <template v-else-if="showingComingSoon && activeType">
        <ShopComingSoon :type="activeType" />
      </template>

      <template v-else-if="showingColoringBooks">
        <ShopFilters class="mt-8" />
        <ShopThemeRow :items="items" />

        <div class="mt-10">
          <header v-if="activeTheme === 'all'" class="mb-6 max-w-2xl">
            <h2 class="font-display text-2xl font-bold text-ink sm:text-3xl">{{ t('shop.allBooksTitle') }}</h2>
            <p class="mt-2 text-muted">{{ t('shop.allBooksLead') }}</p>
          </header>

          <div class="grid gap-4 lg:grid-cols-[1fr_16rem]">
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

          <p class="mt-6 text-sm font-bold text-muted" aria-live="polite">{{ t('shop.resultCount', { count: filtered.length }) }}</p>

          <p v-if="error" class="mt-8" role="alert">
            {{ t('shop.loadError') }}
            <button type="button" class="link ms-2" @click="refresh()">{{ t('shop.retry') }}</button>
          </p>
          <p v-else-if="status === 'pending'" class="mt-8 text-muted">{{ t('shop.loading') }}</p>
          <p v-else-if="!filtered.length" class="mt-8 max-w-xl text-muted">{{ t('shop.empty') }}</p>
          <ProductGrid v-else class="mt-8" :items="filtered" />
        </div>
      </template>
    </section>
  </div>
</template>

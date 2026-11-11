import {
  digitalArtCategories,
  productTypes,
  type CollectionSlug,
  type DigitalArtCategorySlug,
  type ProductTypeSlug,
} from '#shared/catalog'

export function useShopBrowse() {
  const route = useRoute()
  const { data } = useCatalog()

  const activeType = computed<ProductTypeSlug | null>(() => {
    const value = route.query.type
    if (typeof value === 'string' && data.value?.productTypes.includes(value as ProductTypeSlug)) {
      return value as ProductTypeSlug
    }
    // Theme-only links still open coloring books.
    if (typeof route.query.theme === 'string') return 'coloring-books'
    // Category-only links still open digital art.
    if (typeof route.query.category === 'string') return 'digital-art'
    return null
  })

  const hasTypeSelected = computed(() => activeType.value !== null)
  const showingColoringBooks = computed(() => activeType.value === 'coloring-books')
  const showingDigitalArt = computed(() => activeType.value === 'digital-art')
  const showingComingSoon = computed(() => {
    const type = activeType.value
    if (!type || type === 'digital-art') return false
    return productTypes.find((entry) => entry.slug === type)?.ready === false
  })

  const activeTheme = computed(() => {
    if (!showingColoringBooks.value) return 'all' as const
    const value = route.query.theme
    if (typeof value !== 'string') return 'all' as const
    return data.value?.collections.includes(value as CollectionSlug)
      ? value as CollectionSlug
      : 'all' as const
  })

  const activeDigitalCategory = computed<DigitalArtCategorySlug>(() => {
    if (!showingDigitalArt.value) return 'avatars'
    const value = route.query.category
    if (typeof value === 'string' && digitalArtCategories.some((entry) => entry.slug === value)) {
      return value as DigitalArtCategorySlug
    }
    return 'avatars'
  })

  function shopHomeLink() {
    return { path: '/shop' as const }
  }

  function shopLink(options: { type?: string | null, theme?: string, category?: string } = {}) {
    const query: Record<string, string> = {}
    if (typeof route.query.q === 'string' && route.query.q) query.q = route.query.q
    if (typeof route.query.sort === 'string' && route.query.sort) query.sort = route.query.sort

    if (options.type === null) return shopHomeLink()

    const type = options.type ?? activeType.value
    if (type) query.type = type
    if (type === 'coloring-books' && options.theme) query.theme = options.theme
    if (type === 'digital-art' && options.category) query.category = options.category
    return { path: '/shop', query }
  }

  function themeLink(theme: string) {
    return shopLink({ type: 'coloring-books', theme })
  }

  function digitalCategoryLink(category: string) {
    return shopLink({ type: 'digital-art', category })
  }

  return {
    data,
    activeType,
    activeTheme,
    activeDigitalCategory,
    hasTypeSelected,
    showingColoringBooks,
    showingDigitalArt,
    showingComingSoon,
    shopHomeLink,
    shopLink,
    themeLink,
    digitalCategoryLink,
  }
}

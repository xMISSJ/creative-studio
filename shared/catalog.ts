export const collections = [
  { slug: 'books', accent: 'bg-lilac' },
  { slug: 'bold-easy', accent: 'bg-blush' },
  { slug: 'seasonal', accent: 'bg-peach' },
  { slug: 'extras', accent: 'bg-sage' },
] as const

export const badgeKeys = ['new', 'limited', 'bestseller'] as const

export type CollectionSlug = (typeof collections)[number]['slug']
export type BadgeKey = (typeof badgeKeys)[number]

export interface CatalogItem {
  slug: string
  price: number
  collection: CollectionSlug
  image: string
  featured: boolean
  stock: number
  badge?: BadgeKey
  sort: number
}

export interface CatalogPayload {
  items: CatalogItem[]
  collections: CollectionSlug[]
}

export interface CartLine {
  slug: string
  qty: number
}

export function accentFor(slug: string) {
  return collections.find((entry) => entry.slug === slug)?.accent ?? 'bg-lilac'
}

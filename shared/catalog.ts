export const productTypes = [
  { slug: 'coloring-books', accent: 'bg-lilac-mist', ready: true },
  { slug: 'merchandise', accent: 'bg-lilac-soft', ready: false },
  { slug: 'digital-art', accent: 'bg-lilac-glow', ready: false },
] as const

/** Themes apply to coloring books only. */
export const collections = [
  { slug: 'classic', accent: 'bg-lilac' },
  { slug: 'nature', accent: 'bg-sage' },
  { slug: 'fantasy', accent: 'bg-blush' },
  { slug: 'holiday-seasonal', accent: 'bg-peach' },
] as const

/** Categories apply to digital art showcases only. */
export const digitalArtCategories = [
  { slug: 'avatars', accent: 'bg-lilac-glow' },
  { slug: 'character-art', accent: 'bg-sage' },
] as const

/** Groups inside the character-art category. Files live under public/art/character-art/<group>/. */
export const digitalArtCharacterGroups = [
  { slug: 'chibi' },
  { slug: 'original' },
] as const

/** Avatar / character image lists are scanned from public/art at request time. */

export const badgeKeys = ['new', 'limited', 'bestseller'] as const

export type ProductTypeSlug = (typeof productTypes)[number]['slug']
export type CollectionSlug = (typeof collections)[number]['slug']
export type DigitalArtCategorySlug = (typeof digitalArtCategories)[number]['slug']
export type DigitalArtCharacterGroupSlug = (typeof digitalArtCharacterGroups)[number]['slug']
export type BadgeKey = (typeof badgeKeys)[number]

export interface DigitalArtAvatar {
  slug: string
  image: string
  sort: number
}

export interface DigitalArtCharacter {
  slug: string
  group: DigitalArtCharacterGroupSlug
  image: string
  sort: number
}

export interface DigitalArtShowcase {
  avatars: DigitalArtAvatar[]
  characters: DigitalArtCharacter[]
}

export interface CatalogItem {
  slug: string
  price: number
  type: ProductTypeSlug
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
  productTypes: ProductTypeSlug[]
}

export interface CartLine {
  slug: string
  qty: number
}

export function accentFor(slug: string) {
  return collections.find((entry) => entry.slug === slug)?.accent
    ?? digitalArtCategories.find((entry) => entry.slug === slug)?.accent
    ?? productTypes.find((entry) => entry.slug === slug)?.accent
    ?? 'bg-lilac'
}

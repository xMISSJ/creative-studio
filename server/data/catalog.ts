import { collections, productTypes, type CatalogItem, type CatalogPayload } from '../../shared/catalog'

// Coloring-book covers are solid lilac placeholders until Little Memo art is ready.
export const catalog: CatalogItem[] = [
  {
    slug: 'lilac-cafe',
    price: 999,
    type: 'coloring-books',
    collection: 'classic',
    image: '/art/lilac-cafe.svg',
    featured: true,
    stock: 40,
    badge: 'bestseller',
    sort: 1,
  },
  {
    slug: 'quiet-moments',
    price: 999,
    type: 'coloring-books',
    collection: 'classic',
    image: '/art/quiet-moments.svg',
    featured: true,
    stock: 36,
    badge: 'bestseller',
    sort: 2,
  },
  {
    slug: 'puddle-friends',
    price: 999,
    type: 'coloring-books',
    collection: 'nature',
    image: '/art/puddle-friends.svg',
    featured: true,
    stock: 28,
    badge: 'new',
    sort: 3,
  },
  {
    slug: 'hidden-patch',
    price: 999,
    type: 'coloring-books',
    collection: 'nature',
    image: '/art/hidden-patch.svg',
    featured: true,
    stock: 32,
    sort: 4,
  },
  {
    slug: 'kitchen-cuties',
    price: 999,
    type: 'coloring-books',
    collection: 'classic',
    image: '/art/kitchen-cuties.svg',
    featured: true,
    stock: 34,
    badge: 'bestseller',
    sort: 5,
  },
  {
    slug: 'comfort-days',
    price: 999,
    type: 'coloring-books',
    collection: 'classic',
    image: '/art/comfort-days.svg',
    featured: false,
    stock: 30,
    sort: 6,
  },
  {
    slug: 'soft-season',
    price: 999,
    type: 'coloring-books',
    collection: 'holiday-seasonal',
    image: '/art/soft-season.svg',
    featured: true,
    stock: 26,
    badge: 'new',
    sort: 7,
  },
  {
    slug: 'moonlit-cuties',
    price: 999,
    type: 'coloring-books',
    collection: 'fantasy',
    image: '/art/moonlit-cuties.svg',
    featured: false,
    stock: 22,
    sort: 8,
  },
  {
    slug: 'pocket-patterns',
    price: 899,
    type: 'coloring-books',
    collection: 'fantasy',
    image: '/art/pocket-patterns.svg',
    featured: true,
    stock: 48,
    badge: 'new',
    sort: 9,
  },
  {
    slug: 'travel-pockets',
    price: 999,
    type: 'coloring-books',
    collection: 'nature',
    image: '/art/travel-pockets.svg',
    featured: false,
    stock: 24,
    sort: 10,
  },
]

export function getCatalog(): CatalogPayload {
  return {
    items: catalog,
    collections: collections.map((entry) => entry.slug),
    productTypes: productTypes.map((entry) => entry.slug),
  }
}

export function getCatalogItem(slug: string) {
  return catalog.find((item) => item.slug === slug)
}

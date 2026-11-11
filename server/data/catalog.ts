import { collections, type CatalogItem, type CatalogPayload } from '#shared/catalog'

// Cover art under public/art is temporary Everlune placeholder illustration.
export const catalog: CatalogItem[] = [
  {
    slug: 'lilac-cafe',
    price: 999,
    collection: 'books',
    image: '/art/lilac-cafe.jpg',
    featured: true,
    stock: 40,
    badge: 'bestseller',
    sort: 1,
  },
  {
    slug: 'quiet-moments',
    price: 999,
    collection: 'books',
    image: '/art/quiet-moments.jpg',
    featured: true,
    stock: 36,
    badge: 'bestseller',
    sort: 2,
  },
  {
    slug: 'puddle-friends',
    price: 999,
    collection: 'books',
    image: '/art/puddle-friends.jpg',
    featured: true,
    stock: 28,
    badge: 'new',
    sort: 3,
  },
  {
    slug: 'hidden-patch',
    price: 999,
    collection: 'books',
    image: '/art/hidden-patch.jpg',
    featured: true,
    stock: 32,
    sort: 4,
  },
  {
    slug: 'kitchen-cuties',
    price: 999,
    collection: 'bold-easy',
    image: '/art/kitchen-cuties.jpg',
    featured: true,
    stock: 34,
    badge: 'bestseller',
    sort: 5,
  },
  {
    slug: 'comfort-days',
    price: 999,
    collection: 'bold-easy',
    image: '/art/comfort-days.jpg',
    featured: false,
    stock: 30,
    sort: 6,
  },
  {
    slug: 'soft-season',
    price: 999,
    collection: 'seasonal',
    image: '/art/soft-season.jpg',
    featured: true,
    stock: 26,
    badge: 'new',
    sort: 7,
  },
  {
    slug: 'moonlit-cuties',
    price: 999,
    collection: 'seasonal',
    image: '/art/moonlit-cuties.jpg',
    featured: false,
    stock: 22,
    sort: 8,
  },
  {
    slug: 'pocket-patterns',
    price: 899,
    collection: 'extras',
    image: '/art/pocket-patterns.jpg',
    featured: true,
    stock: 48,
    badge: 'new',
    sort: 9,
  },
  {
    slug: 'travel-pockets',
    price: 999,
    collection: 'extras',
    image: '/art/travel-pockets.jpg',
    featured: false,
    stock: 24,
    sort: 10,
  },
]

export function getCatalog(): CatalogPayload {
  return {
    items: catalog,
    collections: collections.map((entry) => entry.slug),
  }
}

export function getCatalogItem(slug: string) {
  return catalog.find((item) => item.slug === slug)
}

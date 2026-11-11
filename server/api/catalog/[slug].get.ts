import { getCatalogItem } from '../../data/catalog'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  const item = slug ? getCatalogItem(slug) : undefined

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  return item
})

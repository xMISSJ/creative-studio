import { getCatalogItem } from '../../data/catalog'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing slug' })
  const item = await getCatalogItem(slug, event)
  if (!item) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  return item
})

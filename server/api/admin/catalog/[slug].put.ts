import type { CatalogItem } from '#shared/catalog'
import { requireAdmin } from '../../../utils/adminSession'
import { normalizeCatalogItem, readShopCatalog, upsertShopCatalogItem } from '../../../utils/shopStore'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing slug' })

  const body = await readBody<Partial<CatalogItem> & { badge?: CatalogItem['badge'] | null | '' }>(event)
  const file = await readShopCatalog(event)
  const current = file.items.find((entry) => entry.slug === slug)
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Product not found' })

  const patch = { ...(body || {}) }
  delete (patch as { slug?: string }).slug

  const merged: Record<string, unknown> = { ...current, ...patch, slug }
  if ('badge' in patch && (patch.badge === null || patch.badge === '')) {
    delete merged.badge
  }

  const next = normalizeCatalogItem(merged)
  if (!next) throw createError({ statusCode: 400, statusMessage: 'Invalid catalog item' })
  return upsertShopCatalogItem(next, event)
})

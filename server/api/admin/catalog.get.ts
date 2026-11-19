import { badgeKeys, collections, productTypes } from '#shared/catalog'
import { requireAdmin } from '../../utils/adminSession'
import { readShopCatalog } from '../../utils/shopStore'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const file = await readShopCatalog(event)
  return {
    items: file.items,
    settings: file.settings,
    collections: collections.map((entry) => entry.slug),
    productTypes: productTypes.map((entry) => entry.slug),
    badges: badgeKeys,
  }
})

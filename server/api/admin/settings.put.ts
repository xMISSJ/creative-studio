import { requireAdmin } from '../../utils/adminSession'
import { updateShopSettings, type ShopSettings } from '../../utils/shopStore'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody<Partial<ShopSettings>>(event)
  return updateShopSettings(body || {}, event)
})

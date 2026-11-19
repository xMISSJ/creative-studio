import { requireAdmin } from '../../utils/adminSession'
import { getDigitalArtShowcase } from '../../data/digitalArt'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return getDigitalArtShowcase(event)
})

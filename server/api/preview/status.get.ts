import { isPreviewGateEnabled, isPreviewUnlocked } from '../../utils/previewAccess'

export default defineEventHandler(async (event) => {
  const enabled = isPreviewGateEnabled(event)
  return {
    enabled,
    unlocked: enabled ? await isPreviewUnlocked(event) : true,
  }
})

import {
  isPreviewGateEnabled,
  isPreviewUnlocked,
  previewComingSoonPath,
  isPreviewExemptPath,
} from '../utils/previewAccess'

/**
 * Hard gate for direct URL hits (/shop, /shop/slug, locale routes, public APIs).
 * Runs before any page HTML so guessed paths never render the shop.
 */
export default defineEventHandler(async (event) => {
  if (!isPreviewGateEnabled(event)) return
  if (await isPreviewUnlocked(event)) return

  const path = getRequestURL(event).pathname
  if (isPreviewExemptPath(path)) return

  if (path.startsWith('/api/')) {
    throw createError({ statusCode: 401, statusMessage: 'Preview locked' })
  }

  return sendRedirect(event, previewComingSoonPath(path), 302)
})

import {
  isPreviewGateEnabled,
  isPreviewUnlocked,
  previewBarePath,
  previewComingSoonPath,
  previewHomePath,
  isPreviewExemptPath,
} from '../utils/previewAccess'

/**
 * Hard gate for direct URL hits (/shop, /shop/slug, locale routes, public APIs).
 * Runs before any page HTML so guessed paths never render the shop.
 */
export default defineEventHandler(async (event) => {
  if (!isPreviewGateEnabled(event)) return

  const path = getRequestURL(event).pathname
  const unlocked = await isPreviewUnlocked(event)

  // Unlocked visitors must not paint the static/SSR coming-soon page first.
  if (unlocked) {
    const bare = previewBarePath(path)
    if (bare === '/coming-soon' || bare.startsWith('/coming-soon/')) {
      return sendRedirect(event, previewHomePath(path), 302)
    }
    return
  }

  if (isPreviewExemptPath(path)) return

  if (path.startsWith('/api/')) {
    throw createError({ statusCode: 401, statusMessage: 'Preview locked' })
  }

  return sendRedirect(event, previewComingSoonPath(path), 302)
})

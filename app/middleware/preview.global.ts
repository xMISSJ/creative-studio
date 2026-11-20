/**
 * SPA backup for Nitro `preview-gate` middleware.
 * Direct visits to /shop (and any slug) are redirected on the server before HTML.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.includes('/coming-soon') || to.path.includes('/studio')) return

  try {
    const status = await $fetch<{ enabled: boolean, unlocked: boolean }>('/api/preview/status')
    if (!status.enabled || status.unlocked) return
    return navigateTo('/coming-soon')
  } catch {
    // Document requests are already enforced by server middleware.
  }
})

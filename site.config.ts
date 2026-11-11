/**
 * Shop identity and stable preferences.
 * Change `name` whenever the studio name changes.
 * Keep `storagePrefix` stable so carts and theme choices survive a rename.
 */
export const siteConfig = {
  name: 'Everlune',
  currency: 'EUR',
  storagePrefix: 'everlune',
  supportEmail: 'hello@everlune.studio',
  lowStockAt: 5,
} as const

/** Browser / social title: `Everlune` on home, `Everlune • Page` elsewhere. */
export function formatPageTitle(page?: string | null) {
  const name = siteConfig.name
  if (!page || page === name) return name
  return `${name} • ${page}`
}

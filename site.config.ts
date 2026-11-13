/**
 * Shop identity and stable preferences.
 * Change `name` / `subtitle` whenever the studio name changes.
 * Keep `storagePrefix` stable so carts and theme choices survive a rename.
 */
export const siteConfig = {
  name: 'Little Memo',
  /** Chinese mark shown with the English name (Ma Shan Zheng). */
  subtitle: '小忆',
  /** Catalog / checkout base currency. Display can switch via the currency dropdown. */
  currency: 'EUR',
  storagePrefix: 'everlune',
  supportEmail: 'hello@everlune.studio',
  lowStockAt: 5,
} as const

/** Browser / social title: `Little Memo` on home, `Little Memo • Page` elsewhere. */
export function formatPageTitle(page?: string | null) {
  const name = siteConfig.name
  if (!page || page === name) return name
  if (page.startsWith(`${name} • `)) return page
  return `${name} • ${page}`
}

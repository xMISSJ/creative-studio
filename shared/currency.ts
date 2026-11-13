/**
 * Display currencies for the shop.
 * Catalog prices stay in `siteConfig.currency` (EUR) cents.
 * `perEur` is an approximate display rate: units of this currency per 1 EUR.
 */
export const currencies = [
  { code: 'EUR', symbol: '€', perEur: 1 },
  { code: 'USD', symbol: '$', perEur: 1.08 },
  { code: 'GBP', symbol: '£', perEur: 0.86 },
  { code: 'PLN', symbol: 'zł', perEur: 4.3 },
  { code: 'CNY', symbol: '¥', perEur: 7.8 },
  { code: 'KRW', symbol: '₩', perEur: 1450 },
  { code: 'JPY', symbol: '¥', perEur: 163 },
  { code: 'RUB', symbol: '₽', perEur: 100 },
] as const

export type CurrencyCode = (typeof currencies)[number]['code']

export function isCurrencyCode(value: string): value is CurrencyCode {
  return currencies.some((entry) => entry.code === value)
}

export function currencyByCode(code: string) {
  return currencies.find((entry) => entry.code === code) ?? currencies[0]
}

/** Convert catalog EUR cents into major units of the display currency. */
export function convertEurCents(cents: number, code: CurrencyCode) {
  const { perEur } = currencyByCode(code)
  return (cents / 100) * perEur
}

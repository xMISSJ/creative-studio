import {
  convertEurCents,
  currencies,
  isCurrencyCode,
  type CurrencyCode,
} from '~~/shared/currency'

function resolveCurrency(value: string | null | undefined, fallback: string): CurrencyCode {
  if (value && isCurrencyCode(value)) return value
  if (isCurrencyCode(fallback)) return fallback
  return 'EUR'
}

export function useCurrency() {
  const brand = useBrand()
  const cookie = useCookie<string>(`${brand.storagePrefix}-currency`, {
    default: () => resolveCurrency(brand.currency, 'EUR'),
    sameSite: 'lax',
    watch: true,
  })

  const currency = computed<CurrencyCode>({
    get() {
      return resolveCurrency(cookie.value, brand.currency)
    },
    set(code) {
      cookie.value = code
    },
  })

  const current = computed(() => currencies.find((entry) => entry.code === currency.value) ?? currencies[0])

  function setCurrency(code: string) {
    if (!isCurrencyCode(code)) return
    currency.value = code
  }

  function convertFromBase(cents: number) {
    return convertEurCents(cents, currency.value)
  }

  return {
    currencies,
    currency,
    current,
    setCurrency,
    convertFromBase,
  }
}

export function useBrand() {
  const { public: config } = useRuntimeConfig()

  return {
    name: String(config.name),
    currency: String(config.currency),
    storagePrefix: String(config.storagePrefix),
    supportEmail: String(config.supportEmail),
    lowStockAt: Number(config.lowStockAt),
  }
}

export function useShopI18n() {
  const { t: translate, tm, rt, locale, locales } = useI18n()
  const brand = useBrand()

  function t(key: string, params: Record<string, unknown> = {}) {
    return translate(key, { name: brand.name, email: brand.supportEmail, ...params })
  }

  function text(entry: unknown) {
    if (typeof entry === 'string') return entry
    if (entry && typeof entry === 'object') return rt(entry as Parameters<typeof rt>[0])
    return ''
  }

  return { t, tm, text, locale, locales, brand }
}

export function useMessageList(key: string) {
  const { tm, text, locale } = useShopI18n()

  return computed(() => {
    void locale.value
    const value = tm(key)
    return Array.isArray(value) ? value.map((entry) => text(entry)).filter(Boolean) : []
  })
}

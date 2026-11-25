import { siteConfig } from '~~/site.config'

export function useBrand() {
  const { public: config } = useRuntimeConfig()

  return {
    name: String(config.name ?? siteConfig.name),
    subtitle: String(config.subtitle ?? siteConfig.subtitle),
    currency: String(config.currency ?? siteConfig.currency),
    storagePrefix: String(config.storagePrefix ?? siteConfig.storagePrefix),
    supportEmail: String(config.supportEmail ?? siteConfig.supportEmail),
    lowStockAt: Number(config.lowStockAt ?? siteConfig.lowStockAt),
  }
}

export function useShopI18n() {
  const { t: translate, tm, rt, locale, locales } = useI18n()
  const brand = useBrand()

  function t(key: string, params: Record<string, unknown> = {}) {
    return translate(key, {
      name: brand.name,
      subtitle: brand.subtitle,
      email: brand.supportEmail,
      ...params,
    })
  }

  const brandParams = () => ({
    name: brand.name,
    subtitle: brand.subtitle,
    email: brand.supportEmail,
  })

  function fillBrand(value: string) {
    return value
      .replaceAll('{name}', brand.name)
      .replaceAll('{subtitle}', brand.subtitle)
      .replaceAll('{email}', brand.supportEmail)
  }

  function text(entry: unknown) {
    if (typeof entry === 'string') return fillBrand(entry)
    if (entry && typeof entry === 'object') {
      try {
        return fillBrand(rt(entry as Parameters<typeof rt>[0], brandParams()))
      } catch {
        return fillBrand(rt(entry as Parameters<typeof rt>[0]))
      }
    }
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

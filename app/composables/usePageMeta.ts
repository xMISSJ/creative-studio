import { formatPageTitle } from '~~/site.config'

export function usePageMeta(titleKey: string, descriptionKey: string) {
  const { t } = useShopI18n()

  useSeoMeta({
    title: () => t(titleKey),
    ogTitle: () => formatPageTitle(t(titleKey)),
    description: () => t(descriptionKey),
    ogDescription: () => t(descriptionKey),
  })
}

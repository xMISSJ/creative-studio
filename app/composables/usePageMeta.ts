import { formatPageTitle } from '~~/site.config'
import { DEFAULT_OG_IMAGE } from './useAbsoluteUrl'

type PageMetaOptions = {
  /** Search robots directive, e.g. `noindex, nofollow`. */
  robots?: MaybeRefOrGetter<string | undefined>
  /** Root-relative public image path for Open Graph / Twitter. */
  image?: MaybeRefOrGetter<string | undefined>
  ogType?: MaybeRefOrGetter<string | undefined>
}

function useSharedSeoMeta(
  title: MaybeRefOrGetter<string>,
  description: MaybeRefOrGetter<string>,
  options: PageMetaOptions = {},
) {
  const brand = useBrand()
  const route = useRoute()
  const { page, shareImage } = useAbsoluteUrl()

  useSeoMeta({
    title: () => formatPageTitle(toValue(title)),
    ogTitle: () => formatPageTitle(toValue(title)),
    description: () => toValue(description),
    ogDescription: () => toValue(description),
    ogSiteName: () => brand.name,
    ogType: () => toValue(options.ogType) || 'website',
    ogUrl: () => page(route.path),
    twitterCard: 'summary_large_image',
    twitterTitle: () => formatPageTitle(toValue(title)),
    twitterDescription: () => toValue(description),
    ogImage: () => shareImage(toValue(options.image) || DEFAULT_OG_IMAGE),
    twitterImage: () => shareImage(toValue(options.image) || DEFAULT_OG_IMAGE),
    robots: () => toValue(options.robots),
  })
}

/** Page title + description from i18n keys (checked by `pnpm check:i18n`). */
export function usePageMeta(titleKey: string, descriptionKey: string, options: PageMetaOptions = {}) {
  const { t } = useShopI18n()
  useSharedSeoMeta(
    () => t(titleKey),
    () => t(descriptionKey),
    options,
  )
}

/** Page title + description from already-resolved strings (filters, product pages). */
export function usePageMetaValues(
  title: MaybeRefOrGetter<string>,
  description: MaybeRefOrGetter<string>,
  options: PageMetaOptions = {},
) {
  useSharedSeoMeta(title, description, options)
}

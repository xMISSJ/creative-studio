import { publicAsset } from './usePublicAsset'

/** Default raster image for Open Graph / Twitter (SVGs are ignored by most crawlers). */
export const DEFAULT_OG_IMAGE = '/art/butterfly.png'

function siteOrigin(siteUrl: string) {
  try {
    return new URL(siteUrl).origin
  } catch {
    return siteUrl.replace(/\/$/, '')
  }
}

/** Absolute URL for a root-relative app path (handles GitHub Pages baseURL). */
export function absoluteUrl(path: string, siteUrl: string, baseURL = '/') {
  const origin = siteOrigin(siteUrl)
  const normalized = path.startsWith('http://') || path.startsWith('https://')
    ? path
    : publicAsset(path === '' ? '/' : path, baseURL)
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) return normalized
  return `${origin}${normalized.startsWith('/') ? normalized : `/${normalized}`}`
}

/** Prefer a raster asset for social cards; fall back to the brand mark. */
export function shareImagePath(path?: string | null) {
  if (!path || path.endsWith('.svg')) return DEFAULT_OG_IMAGE
  return path
}

export function useAbsoluteUrl() {
  const config = useRuntimeConfig()
  const siteUrl = computed(() => String(config.public.siteUrl || 'http://localhost:3000').replace(/\/$/, ''))
  const baseURL = computed(() => config.app.baseURL || '/')

  function page(path: string) {
    return absoluteUrl(path, siteUrl.value, baseURL.value)
  }

  function asset(path: string) {
    return absoluteUrl(path, siteUrl.value, baseURL.value)
  }

  function shareImage(path?: string | null) {
    return asset(shareImagePath(path))
  }

  return { siteUrl, baseURL, page, asset, shareImage }
}

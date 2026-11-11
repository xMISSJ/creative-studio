/** Join a root-relative public path with the app base URL (needed on GitHub Pages). */
export function publicAsset(path: string, baseURL = '/') {
  const normalizedBase = baseURL.endsWith('/') ? baseURL : `${baseURL}/`
  if (!path || path.startsWith('http://') || path.startsWith('https://') || path.startsWith(normalizedBase)) {
    return path
  }
  return `${normalizedBase}${path.replace(/^\//, '')}`
}

/** Prefix a root-relative public path with the app base URL (needed on GitHub Pages). */
export function usePublicAsset(path: string) {
  return publicAsset(path, useRuntimeConfig().app.baseURL || '/')
}

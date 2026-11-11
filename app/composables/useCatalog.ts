import type { CatalogPayload } from '#shared/catalog'

export function useCatalog() {
  const baseURL = useRuntimeConfig().app.baseURL || '/'

  return useFetch<CatalogPayload>('/api/catalog', {
    key: 'catalog',
    // GH Pages serves extensionless API files as octet-stream; force JSON.
    responseType: 'json',
    transform: (payload) => {
      const data = parseStaticJson<CatalogPayload>(payload)
      return {
        ...data,
        items: (data.items ?? []).map((item) => ({
          ...item,
          image: publicAsset(item.image, baseURL),
        })),
      }
    },
  })
}

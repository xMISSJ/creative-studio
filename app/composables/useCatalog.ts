import type { CatalogPayload } from '#shared/catalog'

export function useCatalog() {
  const baseURL = useRuntimeConfig().app.baseURL || '/'

  return useFetch<CatalogPayload>('/api/catalog', {
    key: 'catalog',
    transform: (payload) => ({
      ...payload,
      items: payload.items.map((item) => ({
        ...item,
        image: publicAsset(item.image, baseURL),
      })),
    }),
  })
}

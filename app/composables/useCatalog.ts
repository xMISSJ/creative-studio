export function useCatalog() {
  return useFetch('/api/catalog', { key: 'catalog' })
}

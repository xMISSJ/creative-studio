import type { DigitalArtShowcase } from '#shared/catalog'

export function useDigitalArt() {
  return useFetch<DigitalArtShowcase>('/api/digital-art', { key: 'digital-art' })
}

import type { DigitalArtShowcase } from '#shared/catalog'

export function useDigitalArt() {
  const baseURL = useRuntimeConfig().app.baseURL || '/'

  return useFetch<DigitalArtShowcase>('/api/digital-art', {
    key: 'digital-art',
    transform: (payload) => ({
      avatars: payload.avatars.map((avatar) => ({
        ...avatar,
        image: publicAsset(avatar.image, baseURL),
      })),
      characters: payload.characters.map((piece) => ({
        ...piece,
        image: publicAsset(piece.image, baseURL),
      })),
    }),
  })
}

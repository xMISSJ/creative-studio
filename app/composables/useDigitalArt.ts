import type { DigitalArtShowcase } from '#shared/catalog'

export function useDigitalArt() {
  const baseURL = useRuntimeConfig().app.baseURL || '/'

  return useFetch<DigitalArtShowcase>('/api/digital-art', {
    key: 'digital-art',
    // GH Pages serves extensionless API files as octet-stream; force JSON.
    responseType: 'json',
    transform: (payload) => {
      const data = parseStaticJson<DigitalArtShowcase>(payload)
      return {
        avatars: (data.avatars ?? []).map((avatar) => ({
          ...avatar,
          image: publicAsset(avatar.image, baseURL),
        })),
        characters: (data.characters ?? []).map((piece) => ({
          ...piece,
          image: publicAsset(piece.image, baseURL),
        })),
      }
    },
  })
}

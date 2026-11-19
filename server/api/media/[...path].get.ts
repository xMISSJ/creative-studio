import { getCloudflareEnv } from '../../utils/cfBindings'

export default defineEventHandler(async (event) => {
  const parts = getRouterParam(event, 'path')
  const key = Array.isArray(parts) ? parts.join('/') : String(parts || '')
  if (!key || key.includes('..')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid media path' })
  }

  const media = getCloudflareEnv(event)?.MEDIA
  if (!media) {
    throw createError({ statusCode: 404, statusMessage: 'Media store unavailable' })
  }

  const object = await media.get(key)
  if (!object) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }

  setHeader(event, 'Content-Type', object.httpMetadata?.contentType || 'application/octet-stream')
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  return object.body
})

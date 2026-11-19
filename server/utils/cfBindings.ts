import type { H3Event } from 'h3'

export interface CloudflareEnv {
  DB?: D1Database
  MEDIA?: R2Bucket
  NUXT_ADMIN_PASSWORD?: string
  NUXT_ADMIN_SESSION_SECRET?: string
}

export function getCloudflareEnv(event?: H3Event): CloudflareEnv | undefined {
  try {
    const current = event ?? useEvent()
    return current?.context?.cloudflare?.env as CloudflareEnv | undefined
  } catch {
    return undefined
  }
}

export function hasCloudflareStore(event?: H3Event) {
  const env = getCloudflareEnv(event)
  return Boolean(env?.DB)
}

export function hasCloudflareMedia(event?: H3Event) {
  const env = getCloudflareEnv(event)
  return Boolean(env?.MEDIA)
}

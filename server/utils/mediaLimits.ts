import type { H3Event } from 'h3'
import { getCloudflareEnv, hasCloudflareMedia, hasCloudflareStore } from './cfBindings'

/** Soft cap under Cloudflare's 10 GB free R2 storage. */
export const MAX_MEDIA_BYTES = 8 * 1024 * 1024 * 1024
/** Covers and art uploads stay small on purpose. */
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024
export const MAX_UPLOADS_PER_HOUR = 30

const SETTINGS_MEDIA_BYTES = 'mediaBytesUsed'

async function getSetting(event: H3Event, key: string) {
  const db = getCloudflareEnv(event)?.DB
  if (!db) return null
  const row = await db.prepare('SELECT value FROM shop_settings WHERE key = ?').bind(key).first<{ value: string }>()
  return row?.value ?? null
}

async function setSetting(event: H3Event, key: string, value: string) {
  const db = getCloudflareEnv(event)?.DB
  if (!db) return
  await db.prepare(`
    INSERT INTO shop_settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).bind(key, value).run()
}

async function measureR2Usage(event: H3Event) {
  const media = getCloudflareEnv(event)?.MEDIA
  if (!media) return 0
  let total = 0
  let cursor: string | undefined
  do {
    const page = await media.list({ limit: 1000, cursor })
    for (const object of page.objects) total += object.size
    cursor = page.truncated ? page.cursor : undefined
  } while (cursor)
  return total
}

export async function getMediaBytesUsed(event: H3Event) {
  if (!hasCloudflareMedia(event)) return 0
  const cached = await getSetting(event, SETTINGS_MEDIA_BYTES)
  if (cached !== null && Number.isFinite(Number(cached))) return Number(cached)
  const measured = await measureR2Usage(event)
  if (hasCloudflareStore(event)) await setSetting(event, SETTINGS_MEDIA_BYTES, String(measured))
  return measured
}

export function assertUploadSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Empty upload' })
  }
  if (bytes > MAX_UPLOAD_BYTES) {
    throw createError({
      statusCode: 413,
      statusMessage: `File too large (max ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB)`,
    })
  }
}

export async function assertMediaQuota(event: H3Event, incomingBytes: number) {
  if (!hasCloudflareMedia(event)) return
  const used = await getMediaBytesUsed(event)
  if (used + incomingBytes > MAX_MEDIA_BYTES) {
    throw createError({
      statusCode: 507,
      statusMessage: 'Media storage limit reached (kept under 10 GB free tier)',
    })
  }
}

export async function recordMediaBytes(event: H3Event, delta: number) {
  if (!hasCloudflareMedia(event) || !hasCloudflareStore(event)) return
  const used = await getMediaBytesUsed(event)
  await setSetting(event, SETTINGS_MEDIA_BYTES, String(Math.max(0, used + delta)))
}

/** Basic magic-byte check so renamed executables are rejected. */
export function assertImageBytes(fileName: string, data: Uint8Array) {
  const ext = fileName.toLowerCase().slice(fileName.lastIndexOf('.'))
  if (data.length < 4) {
    throw createError({ statusCode: 400, statusMessage: 'File looks empty or invalid' })
  }

  const isPng = data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47
  const isJpeg = data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff
  const isGif = data[0] === 0x47 && data[1] === 0x49 && data[2] === 0x46
  const isWebp = data[0] === 0x52 && data[1] === 0x49 && data[2] === 0x46 && data[3] === 0x46
  const head = new TextDecoder().decode(data.slice(0, Math.min(data.length, 256))).trimStart()
  const isSvg = head.startsWith('<svg') || head.startsWith('<?xml')

  if (ext === '.png' && isPng) return
  if ((ext === '.jpg' || ext === '.jpeg') && isJpeg) return
  if (ext === '.gif' && isGif) return
  if (ext === '.webp' && isWebp) return
  if (ext === '.svg' && isSvg) return

  throw createError({ statusCode: 400, statusMessage: 'File content does not match an allowed image type' })
}

export async function assertUploadRateLimit(event: H3Event) {
  const db = getCloudflareEnv(event)?.DB
  if (!db) return

  const key = 'upload:admin'
  const now = Date.now()
  const windowMs = 60 * 60 * 1000
  const row = await db.prepare(
    'SELECT count, reset_at FROM admin_rate_limits WHERE key = ?',
  ).bind(key).first<{ count: number, reset_at: number }>()

  if (!row || row.reset_at <= now) {
    await db.prepare(`
      INSERT INTO admin_rate_limits (key, count, reset_at) VALUES (?, 1, ?)
      ON CONFLICT(key) DO UPDATE SET count = 1, reset_at = excluded.reset_at
    `).bind(key, now + windowMs).run()
    return
  }

  if (row.count >= MAX_UPLOADS_PER_HOUR) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many uploads this hour. Try again later.',
    })
  }

  await db.prepare(
    'UPDATE admin_rate_limits SET count = count + 1 WHERE key = ?',
  ).bind(key).run()
}

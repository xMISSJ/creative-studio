import type { H3Event } from 'h3'
import { getCloudflareEnv } from './cfBindings'

const MAX_LOGIN_ATTEMPTS = 8
const WINDOW_MS = 15 * 60 * 1000

const memoryLimits = new Map<string, { count: number, resetAt: number }>()

function clientKey(event: H3Event) {
  const forwarded = getHeader(event, 'cf-connecting-ip')
    || getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
  return `login:${forwarded || getRequestIP(event) || 'local'}`
}

export async function assertLoginAllowed(event: H3Event) {
  const key = clientKey(event)
  const now = Date.now()
  const db = getCloudflareEnv(event)?.DB

  if (db) {
    const row = await db.prepare(
      'SELECT count, reset_at FROM admin_rate_limits WHERE key = ?',
    ).bind(key).first<{ count: number, reset_at: number }>()

    if (row && row.reset_at > now && row.count >= MAX_LOGIN_ATTEMPTS) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Too many login attempts. Wait a bit and try again.',
      })
    }
    return
  }

  const local = memoryLimits.get(key)
  if (local && local.resetAt > now && local.count >= MAX_LOGIN_ATTEMPTS) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many login attempts. Wait a bit and try again.',
    })
  }
}

export async function recordLoginFailure(event: H3Event) {
  const key = clientKey(event)
  const now = Date.now()
  const db = getCloudflareEnv(event)?.DB

  if (db) {
    const row = await db.prepare(
      'SELECT count, reset_at FROM admin_rate_limits WHERE key = ?',
    ).bind(key).first<{ count: number, reset_at: number }>()

    if (!row || row.reset_at <= now) {
      await db.prepare(`
        INSERT INTO admin_rate_limits (key, count, reset_at) VALUES (?, 1, ?)
        ON CONFLICT(key) DO UPDATE SET count = 1, reset_at = excluded.reset_at
      `).bind(key, now + WINDOW_MS).run()
      return
    }

    await db.prepare(
      'UPDATE admin_rate_limits SET count = count + 1 WHERE key = ?',
    ).bind(key).run()
    return
  }

  const local = memoryLimits.get(key)
  if (!local || local.resetAt <= now) {
    memoryLimits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return
  }
  local.count += 1
}

export async function clearLoginFailures(event: H3Event) {
  const key = clientKey(event)
  const db = getCloudflareEnv(event)?.DB
  if (db) {
    await db.prepare('DELETE FROM admin_rate_limits WHERE key = ?').bind(key).run()
    return
  }
  memoryLimits.delete(key)
}

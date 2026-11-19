import type { H3Event } from 'h3'
import { getCloudflareEnv } from './cfBindings'

export const adminSessionCookie = 'lm-admin-session'
const sessionMaxAgeSec = 60 * 60 * 24 * 7

function adminConfig(event?: H3Event) {
  const runtime = useRuntimeConfig(event)
  const cf = getCloudflareEnv(event)
  return {
    password: String(cf?.NUXT_ADMIN_PASSWORD || runtime.adminPassword || ''),
    secret: String(cf?.NUXT_ADMIN_SESSION_SECRET || runtime.adminSessionSecret || runtime.adminPassword || ''),
  }
}

export function isAdminConfigured(event?: H3Event) {
  const { password, secret } = adminConfig(event)
  return Boolean(password && secret)
}

async function sign(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return bufferToBase64Url(signature)
}

function bufferToBase64Url(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function timingSafeEqualString(left: string, right: string) {
  if (left.length !== right.length) return false
  let mismatch = 0
  for (let i = 0; i < left.length; i += 1) mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i)
  return mismatch === 0
}

export async function createAdminToken(event?: H3Event) {
  const { secret } = adminConfig(event)
  if (!secret) throw createError({ statusCode: 503, statusMessage: 'Admin is not configured' })
  const exp = Date.now() + sessionMaxAgeSec * 1000
  const payload = `admin.${exp}`
  return `${payload}.${await sign(payload, secret)}`
}

export async function verifyAdminToken(token: string | undefined | null, event?: H3Event) {
  if (!token) return false
  const { secret } = adminConfig(event)
  if (!secret) return false

  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [role, expRaw, signature] = parts
  if (role !== 'admin') return false
  const exp = Number(expRaw)
  if (!Number.isFinite(exp) || exp < Date.now()) return false

  const payload = `${role}.${expRaw}`
  const expected = await sign(payload, secret)
  return timingSafeEqualString(signature, expected)
}

export async function readAdminSession(event: H3Event) {
  return verifyAdminToken(getCookie(event, adminSessionCookie), event)
}

export async function requireAdmin(event: H3Event) {
  if (!isAdminConfigured(event)) {
    throw createError({ statusCode: 503, statusMessage: 'Admin is not configured' })
  }
  if (!(await readAdminSession(event))) {
    throw createError({ statusCode: 401, statusMessage: 'Admin login required' })
  }
}

export function setAdminSessionCookie(event: H3Event, token: string) {
  setCookie(event, adminSessionCookie, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: sessionMaxAgeSec,
  })
}

export function clearAdminSessionCookie(event: H3Event) {
  deleteCookie(event, adminSessionCookie, { path: '/' })
}

export function passwordsMatch(input: string, event?: H3Event) {
  const { password } = adminConfig(event)
  if (!password) return false
  return timingSafeEqualString(input, password)
}

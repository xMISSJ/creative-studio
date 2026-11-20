import type { H3Event } from 'h3'
import { getCloudflareEnv } from './cfBindings'

export const previewCookie = 'lm-preview-access'
const sessionMaxAgeSec = 60 * 60 * 24 * 30

function previewConfig(event?: H3Event) {
  const runtime = useRuntimeConfig(event)
  const cf = getCloudflareEnv(event)
  const code = String(cf?.NUXT_PREVIEW_CODE || runtime.previewCode || '')
  const secret = String(
    cf?.NUXT_ADMIN_SESSION_SECRET
    || runtime.adminSessionSecret
    || cf?.NUXT_ADMIN_PASSWORD
    || runtime.adminPassword
    || code,
  )
  return { code, secret }
}

export function isPreviewGateEnabled(event?: H3Event) {
  // Local `pnpm dev` stays ungated even when NUXT_PREVIEW_CODE is in .env.
  if (import.meta.dev) return false
  // Prerender must stay open so `/_i18n` message files are real JSON, not redirects to /coming-soon.
  if (import.meta.prerender) return false
  return Boolean(previewConfig(event).code)
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
  const bytes = new Uint8Array(signature)
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

export async function createPreviewToken(event?: H3Event) {
  const { secret } = previewConfig(event)
  const exp = Date.now() + sessionMaxAgeSec * 1000
  const payload = `preview.${exp}`
  return `${payload}.${await sign(payload, secret)}`
}

export async function verifyPreviewToken(token: string | undefined | null, event?: H3Event) {
  if (!token) return false
  const { secret } = previewConfig(event)
  if (!secret) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [role, expRaw, signature] = parts
  if (role !== 'preview') return false
  const exp = Number(expRaw)
  if (!Number.isFinite(exp) || exp < Date.now()) return false
  const payload = `${role}.${expRaw}`
  const expected = await sign(payload, secret)
  return timingSafeEqualString(signature, expected)
}

export async function isPreviewUnlocked(event: H3Event) {
  if (!isPreviewGateEnabled(event)) return true
  return verifyPreviewToken(getCookie(event, previewCookie), event)
}

export function previewCodeMatches(input: string, event?: H3Event) {
  const { code } = previewConfig(event)
  if (!code) return false
  return timingSafeEqualString(input, code)
}

export function setPreviewCookie(event: H3Event, token: string) {
  setCookie(event, previewCookie, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: sessionMaxAgeSec,
  })
}

const localePrefixRe = /^\/(nl|es|fr|zh|ko|ja|pl|de|ru)(?=\/|$)/

/** Path without a locale prefix, for matching /coming-soon and /studio. */
export function previewBarePath(pathname: string) {
  const path = pathname.split('?')[0] || '/'
  const bare = path.replace(localePrefixRe, '')
  return bare || '/'
}

export function previewComingSoonPath(pathname: string) {
  const match = pathname.match(localePrefixRe)
  return match ? `/${match[1]}/coming-soon` : '/coming-soon'
}

/** Paths that stay reachable while the public shop is locked. */
export function isPreviewExemptPath(pathname: string) {
  const path = pathname.split('?')[0] || '/'
  if (path.startsWith('/_nuxt') || path.startsWith('/__nuxt')) return true
  // Locale JSON (lazy + prerenderMessages). Gating this shows raw keys like comingSoon.title.
  if (path.startsWith('/_i18n')) return true
  if (path.startsWith('/api/preview')) return true
  if (path.startsWith('/api/admin')) return true
  if (
    path === '/favicon.svg'
    || path === '/favicon.ico'
    || path === '/robots.txt'
    || path === '/sitemap.xml'
  ) {
    return true
  }

  const bare = previewBarePath(path)
  if (bare === '/coming-soon' || bare.startsWith('/coming-soon/')) return true
  if (bare === '/studio' || bare.startsWith('/studio/')) return true
  return false
}


import {
  createAdminToken,
  isAdminConfigured,
  passwordsMatch,
  setAdminSessionCookie,
} from '../../utils/adminSession'
import {
  assertLoginAllowed,
  clearLoginFailures,
  recordLoginFailure,
} from '../../utils/adminRateLimit'

export default defineEventHandler(async (event) => {
  if (!isAdminConfigured(event)) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Admin is not configured. Set NUXT_ADMIN_PASSWORD in .env or Cloudflare secrets.',
    })
  }

  await assertLoginAllowed(event)

  const body = await readBody<{ password?: string }>(event)
  const password = typeof body?.password === 'string' ? body.password : ''
  if (!password || !passwordsMatch(password, event)) {
    await recordLoginFailure(event)
    throw createError({ statusCode: 401, statusMessage: 'Wrong password' })
  }

  await clearLoginFailures(event)
  const token = await createAdminToken(event)
  setAdminSessionCookie(event, token)
  return { ok: true }
})

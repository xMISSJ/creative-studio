import {
  createPreviewToken,
  isPreviewGateEnabled,
  previewCodeMatches,
  setPreviewCookie,
} from '../../utils/previewAccess'
import {
  assertLoginAllowed,
  clearLoginFailures,
  recordLoginFailure,
} from '../../utils/adminRateLimit'

export default defineEventHandler(async (event) => {
  if (!isPreviewGateEnabled(event)) {
    return { ok: true, enabled: false }
  }

  await assertLoginAllowed(event)

  const body = await readBody<{ code?: string }>(event)
  const code = typeof body?.code === 'string' ? body.code.trim() : ''
  if (!code || !previewCodeMatches(code, event)) {
    await recordLoginFailure(event)
    throw createError({ statusCode: 401, statusMessage: 'Wrong preview code' })
  }

  await clearLoginFailures(event)
  const token = await createPreviewToken(event)
  setPreviewCookie(event, token)
  return { ok: true, enabled: true }
})

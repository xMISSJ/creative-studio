import { isAdminConfigured, readAdminSession } from '../../utils/adminSession'

export default defineEventHandler(async (event) => {
  return {
    configured: isAdminConfigured(event),
    authenticated: await readAdminSession(event),
  }
})

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/studio/login' || to.path.endsWith('/studio/login')) return

  const { data } = await useFetch<{ configured: boolean, authenticated: boolean }>(
    '/api/admin/session',
    { key: 'admin-session' },
  )

  if (!data.value?.authenticated) {
    return navigateTo('/studio/login')
  }
})

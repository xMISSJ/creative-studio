export function useAdminSession() {
  return useFetch<{ configured: boolean, authenticated: boolean }>('/api/admin/session', {
    key: 'admin-session',
  })
}

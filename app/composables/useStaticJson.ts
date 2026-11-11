/**
 * GitHub Pages serves extensionless Nitro API files as application/octet-stream.
 * Force JSON parsing so ofetch does not hand us a Blob/string that breaks transforms.
 */
export function parseStaticJson<T extends object>(payload: T | string): T {
  if (typeof payload === 'string') {
    return JSON.parse(payload) as T
  }
  return payload
}

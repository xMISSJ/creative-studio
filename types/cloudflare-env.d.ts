/// <reference types="@cloudflare/workers-types" />

declare module 'h3' {
  interface H3EventContext {
    cloudflare?: {
      env: {
        DB?: D1Database
        MEDIA?: R2Bucket
        NUXT_ADMIN_PASSWORD?: string
        NUXT_ADMIN_SESSION_SECRET?: string
      }
    }
  }
}

export {}

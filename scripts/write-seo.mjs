import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const catalogSource = readFileSync(join(root, 'server', 'data', 'catalog.ts'), 'utf8')
const productSlugs = [...catalogSource.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1])

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const baseURL = process.env.NUXT_APP_BASE_URL
  || (process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : '/')
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL
  || (process.env.GITHUB_ACTIONS && process.env.GITHUB_REPOSITORY_OWNER && repoName
    ? `https://${process.env.GITHUB_REPOSITORY_OWNER.toLowerCase()}.github.io/${repoName}`
    : 'http://localhost:3000')).replace(/\/$/, '')

const localePrefixes = ['', '/nl', '/es', '/fr', '/zh', '/ko', '/ja', '/pl', '/de', '/ru']
const indexablePages = ['/', '/shop', '/about', '/faq']
const privatePages = ['/cart', '/checkout', '/login', '/register', '/account']

function joinBase(path) {
  const normalizedBase = baseURL.endsWith('/') ? baseURL : `${baseURL}/`
  if (path === '/') return normalizedBase
  return `${normalizedBase}${path.replace(/^\//, '')}`.replace(/\/{2,}/g, '/')
}

function absolutePage(path) {
  try {
    const origin = new URL(siteUrl).origin
    const withBase = joinBase(path)
    return `${origin}${withBase.startsWith('/') ? withBase : `/${withBase}`}`
  } catch {
    return `${siteUrl}${joinBase(path)}`
  }
}

const urls = []
for (const prefix of localePrefixes) {
  for (const path of indexablePages) {
    const localized = path === '/' ? (prefix || '/') : `${prefix}${path}`
    urls.push(absolutePage(localized))
  }
  for (const slug of productSlugs) {
    urls.push(absolutePage(`${prefix}/shop/${slug}`))
  }
}

const uniqueUrls = [...new Set(urls)]
const lastmod = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls.map((loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>
`

const disallowPaths = localePrefixes.flatMap((prefix) =>
  privatePages.map((path) => joinBase(`${prefix}${path}`)),
)

const robots = `User-Agent: *
Allow: /

${disallowPaths.map((path) => `Disallow: ${path}`).join('\n')}

Sitemap: ${absolutePage('/sitemap.xml')}
`

const outDir = process.env.SEO_OUT_DIR
  || (process.argv.includes('--public') ? join(root, 'public') : join(root, '.output', 'public'))

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'sitemap.xml'), `${sitemap.trim()}\n`)
writeFileSync(join(outDir, 'robots.txt'), `${robots.trim()}\n`)
console.log(`Wrote sitemap (${uniqueUrls.length} URLs) and robots.txt to ${outDir}`)

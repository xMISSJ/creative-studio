import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = process.cwd()
const localeDir = join(root, 'i18n', 'locales')
const catalogSource = readFileSync(join(root, 'server', 'data', 'catalog.ts'), 'utf8')

function flatten(value, prefix = '', out = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => flatten(item, `${prefix}${index}.`, out))
    return out
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) flatten(child, `${prefix}${key}.`, out)
    return out
  }
  if (prefix) out.add(prefix.slice(0, -1))
  return out
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) walk(path, acc)
    else if (path.endsWith('.vue') || path.endsWith('.ts')) acc.push(path)
  }
  return acc
}

const localeFiles = readdirSync(localeDir).filter((file) => file.endsWith('.json')).sort()
const problems = []
if (localeFiles.length < 2) {
  console.error('Add at least two locale files in i18n/locales.')
  process.exit(1)
}

function findUnsafeSyntax(value, file, prefix = '') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => findUnsafeSyntax(item, file, `${prefix}${index}.`))
    return
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) findUnsafeSyntax(child, file, `${prefix}${key}.`)
    return
  }
  if (typeof value !== 'string') return
  const stripped = value.replaceAll("{'@'}", '')
  if (stripped.includes('@')) problems.push(`${file} ${prefix.slice(0, -1)} contains @. Write it as {'@'}.`)
  if (stripped.includes("'")) problems.push(`${file} ${prefix.slice(0, -1)} contains an apostrophe. Rephrase it so vue-i18n does not treat it as syntax.`)
}

const localeJson = Object.fromEntries(localeFiles.map((file) => [file, JSON.parse(readFileSync(join(localeDir, file), 'utf8'))]))
for (const [file, json] of Object.entries(localeJson)) findUnsafeSyntax(json, file)
const locales = Object.fromEntries(Object.entries(localeJson).map(([file, json]) => [file, flatten(json)]))
const [baseFile, baseKeys] = [localeFiles[0], locales[localeFiles[0]]]

for (const file of localeFiles.slice(1)) {
  const keys = locales[file]
  for (const key of baseKeys) if (!keys.has(key)) problems.push(`${file} is missing ${key}`)
  for (const key of keys) if (!baseKeys.has(key)) problems.push(`${baseFile} is missing ${key}`)
}

const slugs = [...catalogSource.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1])
const collections = [...new Set([...catalogSource.matchAll(/collection:\s*'([^']+)'/g)].map((match) => match[1]))]
const badges = [...new Set([...catalogSource.matchAll(/badge:\s*'([^']+)'/g)].map((match) => match[1]))]
const images = [...catalogSource.matchAll(/image:\s*'([^']+)'/g)].map((match) => match[1])

for (const slug of slugs) {
  for (const key of ['title', 'summary', 'description', 'alt']) {
    const path = `products.${slug}.${key}`
    if (!baseKeys.has(path)) problems.push(`Catalog slug "${slug}" needs ${path} in every locale`)
  }
  if (![...baseKeys].some((key) => key.startsWith(`products.${slug}.details.`))) {
    problems.push(`Catalog slug "${slug}" needs products.${slug}.details in every locale`)
  }
}

for (const slug of collections) {
  for (const key of ['title', 'summary', 'body']) {
    const path = `collections.${slug}.${key}`
    if (!baseKeys.has(path)) problems.push(`Collection "${slug}" needs ${path} in every locale`)
  }
}

for (const badge of badges) {
  const path = `badges.${badge}`
  if (!baseKeys.has(path)) problems.push(`Badge "${badge}" needs ${path} in every locale`)
}

for (const image of images) {
  if (!existsSync(join(root, 'public', image))) problems.push(`Missing artwork file public${image}`)
}

const dynamicPatterns = [
  /^products\.\$\{[^}]+\}\.(title|summary|description|alt|details)$/,
  /^collections\.\$\{[^}]+\}\.(title|summary|body)$/,
  /^badges\.\$\{[^}]+\}$/,
]

function hasMessage(key) {
  if (baseKeys.has(key)) return true
  const prefix = `${key}.`
  for (const item of baseKeys) if (item.startsWith(prefix)) return true
  return false
}

for (const file of walk(join(root, 'app'))) {
  const source = readFileSync(file, 'utf8')
  const rel = relative(root, file)

  if (source.includes('$t(')) problems.push(`${rel} uses $t(). Call t() from useShopI18n() so the shop name is included.`)

  const calls = source.matchAll(/\b(?:t|tm|useMessageList)\(\s*(['"`])([\s\S]*?)\1/g)
  for (const match of calls) {
    const key = match[2]
    if (key.includes('${')) {
      if (!dynamicPatterns.some((pattern) => pattern.test(key))) {
        problems.push(`${rel} has an unregistered dynamic message: ${key}`)
      }
      continue
    }
    if (!hasMessage(key)) problems.push(`${rel} uses missing message "${key}"`)
  }

  if (!file.endsWith('usePageMeta.ts') && /(?<!function )\bt\(\s*[A-Za-z_]/.test(source)) {
    problems.push(`${rel} calls t() with a variable. Use a string literal so translations can be checked.`)
  }

  for (const match of source.matchAll(/\busePageMeta\(\s*'([^']+)'\s*,\s*'([^']+)'/g)) {
    if (!hasMessage(match[1])) problems.push(`${rel} uses missing message "${match[1]}"`)
    if (!hasMessage(match[2])) problems.push(`${rel} uses missing message "${match[2]}"`)
  }

  if (!file.endsWith('.vue')) continue
  const template = source.match(/<template>([\s\S]*)<\/template>/)?.[1]
  if (!template) continue

  const visible = template
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/"[^"]*"/g, ' ')
    .replace(/'[^']*'/g, ' ')
    .replace(/\{\{[\s\S]*?\}\}/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')

  const words = visible.match(/[A-Za-z]{2,}/g)
  if (words) problems.push(`${rel} has hardcoded template text: ${words.join(', ')}`)

  const attrs = template.matchAll(/(?:^|[\s])(?:placeholder|alt|aria-label|title)="([^"]*)"/g)
  for (const attr of attrs) {
    if (/[A-Za-z]{2,}/.test(attr[1])) problems.push(`${rel} has hardcoded attribute text: ${attr[1]}`)
  }
}

if (problems.length) {
  console.error(`i18n check failed (${problems.length})`)
  for (const problem of problems) console.error(`- ${problem}`)
  process.exit(1)
}

console.log(`i18n check passed for ${localeFiles.join(', ')}`)

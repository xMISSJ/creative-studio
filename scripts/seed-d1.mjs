/**
 * Seed D1 from data/shop-catalog.json and public/art digital files.
 * Usage:
 *   node scripts/seed-d1.mjs            # prints SQL
 *   node scripts/seed-d1.mjs --apply    # apply local D1 via wrangler
 *   node scripts/seed-d1.mjs --remote   # apply remote D1 via wrangler
 */
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const catalog = JSON.parse(readFileSync(join(root, 'data', 'shop-catalog.json'), 'utf8'))
const imageExt = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif'])

function listImages(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter((name) => imageExt.has(extname(name).toLowerCase()))
}

function slugFromFile(file) {
  return basename(file, extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function sqlString(value) {
  if (value === null || value === undefined) return 'NULL'
  return `'${String(value).replaceAll("'", "''")}'`
}

const lines = []
lines.push('DELETE FROM catalog_items;')
lines.push('DELETE FROM shop_settings;')
lines.push('DELETE FROM digital_art;')

for (const item of catalog.items || []) {
  lines.push(`INSERT INTO catalog_items (slug, price, type, collection, image, featured, stock, badge, sort) VALUES (${sqlString(item.slug)}, ${Number(item.price)}, ${sqlString(item.type)}, ${sqlString(item.collection)}, ${sqlString(item.image)}, ${item.featured ? 1 : 0}, ${Number(item.stock)}, ${item.badge ? sqlString(item.badge) : 'NULL'}, ${Number(item.sort)});`)
}

const cardPrice = catalog.settings?.customCardPriceCents ?? 699
lines.push(`INSERT INTO shop_settings (key, value) VALUES ('customCardPriceCents', ${sqlString(String(cardPrice))});`)

listImages(join(root, 'public', 'art', 'avatars')).forEach((file, index) => {
  const slug = slugFromFile(file) || `avatar-${index + 1}`
  const image = `/art/avatars/${encodeURIComponent(file)}`
  lines.push(`INSERT INTO digital_art (id, kind, slug, group_slug, image, sort) VALUES (${sqlString(`avatar:${slug}`)}, 'avatar', ${sqlString(slug)}, NULL, ${sqlString(image)}, ${index + 1});`)
})

listImages(join(root, 'public', 'art', 'character-art', 'chibi')).forEach((file, index) => {
  const slug = slugFromFile(file) || `chibi-${index + 1}`
  const image = `/art/character-art/chibi/${encodeURIComponent(file)}`
  lines.push(`INSERT INTO digital_art (id, kind, slug, group_slug, image, sort) VALUES (${sqlString(`character:chibi:${slug}`)}, 'character', ${sqlString(slug)}, 'chibi', ${sqlString(image)}, ${index + 1});`)
})

const sql = `${lines.join('\n')}\n`
const outDir = join(root, '.data')
mkdirSync(outDir, { recursive: true })
const sqlPath = join(outDir, 'seed-d1.sql')
writeFileSync(sqlPath, sql)

const apply = process.argv.includes('--apply')
const remote = process.argv.includes('--remote')

if (!apply && !remote) {
  console.log(`Wrote ${sqlPath}`)
  console.log('Apply locally:  pnpm seed:d1')
  console.log('Apply remote:   pnpm seed:d1:remote')
  process.exit(0)
}

const args = ['wrangler', 'd1', 'execute', 'little-memo-shop', '--file', sqlPath]
if (remote) args.push('--remote')
else args.push('--local')

const result = spawnSync('npx', args, { stdio: 'inherit', shell: true })
process.exit(result.status ?? 1)

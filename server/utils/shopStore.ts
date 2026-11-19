import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { H3Event } from 'h3'
import {
  badgeKeys,
  collections,
  productTypes,
  type BadgeKey,
  type CatalogItem,
  type CatalogPayload,
  type CollectionSlug,
  type ProductTypeSlug,
  type ShopSettings,
} from '#shared/catalog'
import { getCloudflareEnv, hasCloudflareStore } from './cfBindings'

export type { ShopSettings }

export interface ShopCatalogFile {
  items: CatalogItem[]
  settings: ShopSettings
}

const catalogPath = () => join(process.cwd(), 'data', 'shop-catalog.json')

const defaultSettings: ShopSettings = {
  customCardPriceCents: 699,
}

function isProductType(value: unknown): value is ProductTypeSlug {
  return productTypes.some((entry) => entry.slug === value)
}

function isCollection(value: unknown): value is CollectionSlug {
  return collections.some((entry) => entry.slug === value)
}

function isBadge(value: unknown): value is BadgeKey {
  return badgeKeys.includes(value as BadgeKey)
}

function isImagePath(value: string) {
  return value.startsWith('/') || value.startsWith('https://')
}

export function normalizeCatalogItem(value: unknown): CatalogItem | null {
  if (!value || typeof value !== 'object') return null
  const raw = value as Partial<CatalogItem>
  if (typeof raw.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw.slug)) return null
  if (typeof raw.price !== 'number' || !Number.isFinite(raw.price) || raw.price < 0) return null
  if (!isProductType(raw.type)) return null
  if (!isCollection(raw.collection)) return null
  if (typeof raw.image !== 'string' || !isImagePath(raw.image)) return null
  if (typeof raw.featured !== 'boolean') return null
  if (typeof raw.stock !== 'number' || !Number.isFinite(raw.stock) || raw.stock < 0) return null
  if (typeof raw.sort !== 'number' || !Number.isFinite(raw.sort)) return null
  if (raw.badge !== undefined && !isBadge(raw.badge)) return null

  const item: CatalogItem = {
    slug: raw.slug,
    price: Math.round(raw.price),
    type: raw.type,
    collection: raw.collection,
    image: raw.image,
    featured: raw.featured,
    stock: Math.round(raw.stock),
    sort: Math.round(raw.sort),
  }
  if (raw.badge) item.badge = raw.badge
  return item
}

function normalizeSettings(value: unknown): ShopSettings {
  if (!value || typeof value !== 'object') return { ...defaultSettings }
  const raw = value as Partial<ShopSettings>
  const cents = typeof raw.customCardPriceCents === 'number' && Number.isFinite(raw.customCardPriceCents)
    ? Math.max(0, Math.round(raw.customCardPriceCents))
    : defaultSettings.customCardPriceCents
  return { customCardPriceCents: cents }
}

function payloadFromFile(file: ShopCatalogFile): CatalogPayload {
  return {
    items: file.items,
    collections: collections.map((entry) => entry.slug),
    productTypes: productTypes.map((entry) => entry.slug),
    settings: file.settings,
  }
}

export function readShopCatalogFile(): ShopCatalogFile {
  const path = catalogPath()
  if (!existsSync(path)) {
    return { items: [], settings: { ...defaultSettings } }
  }
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as Partial<ShopCatalogFile>
  const items = Array.isArray(parsed.items)
    ? parsed.items.map(normalizeCatalogItem).filter((item): item is CatalogItem => Boolean(item))
    : []
  return {
    items: items.sort((a, b) => a.sort - b.sort || a.slug.localeCompare(b.slug)),
    settings: normalizeSettings(parsed.settings),
  }
}

export function writeShopCatalogFile(file: ShopCatalogFile) {
  const path = catalogPath()
  mkdirSync(dirname(path), { recursive: true })
  const payload: ShopCatalogFile = {
    items: file.items
      .map(normalizeCatalogItem)
      .filter((item): item is CatalogItem => Boolean(item))
      .sort((a, b) => a.sort - b.sort || a.slug.localeCompare(b.slug)),
    settings: normalizeSettings(file.settings),
  }
  writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  return payload
}

async function readFromD1(event: H3Event): Promise<ShopCatalogFile> {
  const db = getCloudflareEnv(event)?.DB
  if (!db) return readShopCatalogFile()

  const { results } = await db.prepare(`
    SELECT slug, price, type, collection, image, featured, stock, badge, sort
    FROM catalog_items
    ORDER BY sort ASC, slug ASC
  `).all<Record<string, unknown>>()

  const items = (results || [])
    .map((row) => normalizeCatalogItem({
      slug: row.slug,
      price: Number(row.price),
      type: row.type,
      collection: row.collection,
      image: row.image,
      featured: Boolean(row.featured),
      stock: Number(row.stock),
      badge: row.badge || undefined,
      sort: Number(row.sort),
    }))
    .filter((item): item is CatalogItem => Boolean(item))

  const settingsRow = await db.prepare(
    'SELECT value FROM shop_settings WHERE key = ?',
  ).bind('customCardPriceCents').first<{ value: string }>()

  const settings = normalizeSettings({
    customCardPriceCents: settingsRow?.value ? Number(settingsRow.value) : defaultSettings.customCardPriceCents,
  })

  return { items, settings }
}

async function writeItemToD1(event: H3Event, item: CatalogItem) {
  const db = getCloudflareEnv(event)?.DB
  if (!db) throw createError({ statusCode: 503, statusMessage: 'D1 is not bound' })

  await db.prepare(`
    INSERT INTO catalog_items (slug, price, type, collection, image, featured, stock, badge, sort)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      price = excluded.price,
      type = excluded.type,
      collection = excluded.collection,
      image = excluded.image,
      featured = excluded.featured,
      stock = excluded.stock,
      badge = excluded.badge,
      sort = excluded.sort
  `).bind(
    item.slug,
    item.price,
    item.type,
    item.collection,
    item.image,
    item.featured ? 1 : 0,
    item.stock,
    item.badge ?? null,
    item.sort,
  ).run()
}

async function writeSettingsToD1(event: H3Event, settings: ShopSettings) {
  const db = getCloudflareEnv(event)?.DB
  if (!db) throw createError({ statusCode: 503, statusMessage: 'D1 is not bound' })
  await db.prepare(`
    INSERT INTO shop_settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).bind('customCardPriceCents', String(settings.customCardPriceCents)).run()
}

export async function getShopCatalogPayload(event?: H3Event): Promise<CatalogPayload> {
  if (event && hasCloudflareStore(event)) {
    return payloadFromFile(await readFromD1(event))
  }
  return payloadFromFile(readShopCatalogFile())
}

export async function getShopCatalogItem(slug: string, event?: H3Event) {
  const payload = await getShopCatalogPayload(event)
  return payload.items.find((item) => item.slug === slug)
}

export async function readShopCatalog(event?: H3Event): Promise<ShopCatalogFile> {
  if (event && hasCloudflareStore(event)) return readFromD1(event)
  return readShopCatalogFile()
}

export async function upsertShopCatalogItem(input: unknown, event?: H3Event) {
  const item = normalizeCatalogItem(input)
  if (!item) throw createError({ statusCode: 400, statusMessage: 'Invalid catalog item' })

  if (event && hasCloudflareStore(event)) {
    await writeItemToD1(event, item)
    return item
  }

  const file = readShopCatalogFile()
  const index = file.items.findIndex((entry) => entry.slug === item.slug)
  if (index >= 0) file.items[index] = item
  else file.items.push(item)
  writeShopCatalogFile(file)
  return item
}

export async function patchShopCatalogItem(slug: string, patch: Partial<CatalogItem>, event?: H3Event) {
  const current = await getShopCatalogItem(slug, event)
  if (!current) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  const next = normalizeCatalogItem({ ...current, ...patch, slug })
  if (!next) throw createError({ statusCode: 400, statusMessage: 'Invalid catalog item' })
  return upsertShopCatalogItem(next, event)
}

export async function deleteShopCatalogItem(slug: string, event?: H3Event) {
  if (event && hasCloudflareStore(event)) {
    const db = getCloudflareEnv(event)?.DB
    if (!db) throw createError({ statusCode: 503, statusMessage: 'D1 is not bound' })
    const result = await db.prepare('DELETE FROM catalog_items WHERE slug = ?').bind(slug).run()
    if (!result.meta.changes) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
    return
  }

  const file = readShopCatalogFile()
  const nextItems = file.items.filter((entry) => entry.slug !== slug)
  if (nextItems.length === file.items.length) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }
  file.items = nextItems
  writeShopCatalogFile(file)
}

export async function updateShopSettings(patch: Partial<ShopSettings>, event?: H3Event) {
  const current = await readShopCatalog(event)
  const settings = normalizeSettings({ ...current.settings, ...patch })

  if (event && hasCloudflareStore(event)) {
    await writeSettingsToD1(event, settings)
    return settings
  }

  current.settings = settings
  writeShopCatalogFile(current)
  return settings
}

import { existsSync, readdirSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import type { H3Event } from 'h3'
import {
  digitalArtCharacterGroups,
  type DigitalArtCharacter,
  type DigitalArtCharacterGroupSlug,
  type DigitalArtShowcase,
} from '#shared/catalog'
import { getCloudflareEnv, hasCloudflareStore } from './cfBindings'

const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif'])

function publicRoot() {
  return join(process.cwd(), 'public')
}

function listImageFiles(dir: string) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((name) => imageExtensions.has(extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
}

function slugFromFile(file: string) {
  return basename(file, extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function publicImagePath(...parts: string[]) {
  return `/${parts.map((part) => encodeURIComponent(part)).join('/')}`
}

function listFromFilesystem(): DigitalArtShowcase {
  const root = publicRoot()
  const avatars = listImageFiles(join(root, 'art', 'avatars')).map((file, index) => ({
    slug: slugFromFile(file) || `avatar-${index + 1}`,
    image: publicImagePath('art', 'avatars', file),
    sort: index + 1,
  }))

  const characters: DigitalArtCharacter[] = digitalArtCharacterGroups.flatMap((group) =>
    listImageFiles(join(root, 'art', 'character-art', group.slug)).map((file, index) => ({
      slug: slugFromFile(file) || `${group.slug}-${index + 1}`,
      group: group.slug,
      image: publicImagePath('art', 'character-art', group.slug, file),
      sort: index + 1,
    })),
  )

  return { avatars, characters }
}

async function listFromD1(event: H3Event): Promise<DigitalArtShowcase> {
  const db = getCloudflareEnv(event)?.DB
  if (!db) return listFromFilesystem()

  const { results } = await db.prepare(`
    SELECT id, kind, slug, group_slug, image, sort
    FROM digital_art
    ORDER BY sort ASC, slug ASC
  `).all<{
    id: string
    kind: string
    slug: string
    group_slug: string | null
    image: string
    sort: number
  }>()

  const rows = results || []
  if (!rows.length) return listFromFilesystem()

  return {
    avatars: rows
      .filter((row) => row.kind === 'avatar')
      .map((row) => ({ slug: row.slug, image: row.image, sort: row.sort })),
    characters: rows
      .filter((row) => row.kind === 'character')
      .map((row) => ({
        slug: row.slug,
        group: (row.group_slug || 'chibi') as DigitalArtCharacterGroupSlug,
        image: row.image,
        sort: row.sort,
      })),
  }
}

export async function getDigitalArtShowcase(event?: H3Event): Promise<DigitalArtShowcase> {
  if (event && hasCloudflareStore(event)) return listFromD1(event)
  return listFromFilesystem()
}

export async function upsertDigitalArtEntry(
  event: H3Event,
  entry: {
    kind: 'avatar' | 'character'
    slug: string
    group?: string
    image: string
    sort?: number
  },
) {
  const db = getCloudflareEnv(event)?.DB
  if (!db) return

  const id = entry.kind === 'avatar'
    ? `avatar:${entry.slug}`
    : `character:${entry.group || 'chibi'}:${entry.slug}`

  const existing = await db.prepare('SELECT sort FROM digital_art WHERE id = ?').bind(id).first<{ sort: number }>()
  const sort = entry.sort ?? existing?.sort ?? Date.now()

  await db.prepare(`
    INSERT INTO digital_art (id, kind, slug, group_slug, image, sort)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      image = excluded.image,
      group_slug = excluded.group_slug,
      sort = excluded.sort
  `).bind(
    id,
    entry.kind,
    entry.slug,
    entry.kind === 'character' ? (entry.group || 'chibi') : null,
    entry.image,
    sort,
  ).run()
}

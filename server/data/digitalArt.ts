import { existsSync, readdirSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import {
  digitalArtCharacterGroups,
  type DigitalArtCharacter,
  type DigitalArtShowcase,
} from '#shared/catalog'

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

export function getDigitalArtShowcase(): DigitalArtShowcase {
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

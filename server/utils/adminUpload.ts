import { mkdirSync, writeFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import type { H3Event } from 'h3'
import { digitalArtCharacterGroups } from '#shared/catalog'
import { getCloudflareEnv, hasCloudflareMedia } from './cfBindings'
import { upsertDigitalArtEntry } from './digitalArtStore'
import {
  assertImageBytes,
  assertMediaQuota,
  assertUploadRateLimit,
  assertUploadSize,
  recordMediaBytes,
} from './mediaLimits'

const allowedExt = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'])

const uploadTargets = {
  covers: 'art',
  avatars: 'art/avatars',
  characters: 'art/character-art/chibi',
} as const

export type UploadTarget = keyof typeof uploadTargets

export function isUploadTarget(value: string): value is UploadTarget {
  return value in uploadTargets
}

export function characterGroupFolder(group: string) {
  if (!digitalArtCharacterGroups.some((entry) => entry.slug === group)) return null
  return `art/character-art/${group}`
}

function safeFileName(name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || `upload-${Date.now()}`
}

function contentTypeFor(ext: string) {
  if (ext === '.svg') return 'image/svg+xml'
  if (ext === '.png') return 'image/png'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.gif') return 'image/gif'
  return 'application/octet-stream'
}

export async function savePublicUpload(options: {
  folder: string
  fileName: string
  data: Uint8Array
  target?: UploadTarget
  group?: string
  event?: H3Event
}) {
  const ext = extname(options.fileName).toLowerCase()
  if (!allowedExt.has(ext)) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported file type' })
  }
  if (options.folder.includes('..') || options.folder.startsWith('/') || options.folder.includes('\\')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid upload folder' })
  }
  if (!options.folder.startsWith('art')) {
    throw createError({ statusCode: 400, statusMessage: 'Uploads must stay under art/' })
  }

  assertUploadSize(options.data.byteLength)
  assertImageBytes(options.fileName, options.data)

  const cleanName = safeFileName(options.fileName)
  const objectKey = `${options.folder}/${cleanName}`

  if (options.event && hasCloudflareMedia(options.event)) {
    await assertUploadRateLimit(options.event)
    await assertMediaQuota(options.event, options.data.byteLength)

    const media = getCloudflareEnv(options.event)?.MEDIA
    if (!media) throw createError({ statusCode: 503, statusMessage: 'R2 is not bound' })

    const existing = await media.head(objectKey)
    const replacedBytes = existing?.size || 0

    await media.put(objectKey, options.data, {
      httpMetadata: { contentType: contentTypeFor(ext) },
    })
    await recordMediaBytes(options.event, options.data.byteLength - replacedBytes)

    const publicPath = `/api/media/${objectKey.split('/').map(encodeURIComponent).join('/')}`

    if (options.target === 'avatars' || options.target === 'characters') {
      await upsertDigitalArtEntry(options.event, {
        kind: options.target === 'avatars' ? 'avatar' : 'character',
        slug: cleanName.replace(ext, '') || cleanName,
        group: options.target === 'characters' ? (options.group || 'chibi') : undefined,
        image: publicPath,
      })
    }

    return { path: publicPath, fileName: cleanName }
  }

  const absoluteDir = join(process.cwd(), 'public', ...options.folder.split('/'))
  mkdirSync(absoluteDir, { recursive: true })
  const absolutePath = join(absoluteDir, cleanName)
  writeFileSync(absolutePath, options.data)

  const publicPath = `/${options.folder.split('/').map(encodeURIComponent).join('/')}/${encodeURIComponent(cleanName)}`
  return { path: publicPath, fileName: cleanName }
}

export function folderForTarget(target: UploadTarget, group?: string) {
  if (target === 'characters') {
    const folder = characterGroupFolder(group || 'chibi')
    if (!folder) throw createError({ statusCode: 400, statusMessage: 'Unknown character group' })
    return folder
  }
  return uploadTargets[target]
}

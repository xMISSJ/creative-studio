/** Card studio formats, sizes, papers, and placeholder art registry. */

export const cardFormats = [
  { slug: 'flat', faces: ['front', 'back'] as const },
  { slug: 'fold', faces: ['front', 'inside-left', 'inside-right', 'back'] as const },
] as const

/** How a fold card opens. Spine sits on the opposite edge. */
export const cardFoldDirections = [
  { slug: 'right', crease: 'vertical' },
  { slug: 'left', crease: 'vertical' },
  { slug: 'down', crease: 'horizontal' },
  { slug: 'up', crease: 'horizontal' },
] as const

export const cardSizes = [
  /** 105 × 148 mm */
  { slug: 'a6', widthMm: 105, heightMm: 148, aspect: 105 / 148 },
  /** 148 × 210 mm */
  { slug: 'a5', widthMm: 148, heightMm: 210, aspect: 148 / 210 },
  /** ~140 × 140 mm */
  { slug: 'square', widthMm: 140, heightMm: 140, aspect: 1 },
] as const

export const cardPapers = [
  { slug: 'cream', cssVar: '--paper' },
  { slug: 'blush', cssVar: '--blush' },
  { slug: 'sage', cssVar: '--sage' },
  { slug: 'peach', cssVar: '--peach' },
  { slug: 'lilac', cssVar: '--lilac-mist' },
] as const

export const cardTextColors = ['ink', 'muted', 'accent'] as const

export const cardAssetTags = ['shape', 'nature', 'creature', 'background'] as const

/** Placeholder printed-card price in cents (EUR catalog base). */
export const customCardPriceCents = 699

export type CardFormatSlug = (typeof cardFormats)[number]['slug']
export type CardFoldDirection = (typeof cardFoldDirections)[number]['slug']
export type CardSizeSlug = (typeof cardSizes)[number]['slug']
export type CardPaperSlug = (typeof cardPapers)[number]['slug']
export type CardTextColor = (typeof cardTextColors)[number]
export type CardAssetTag = (typeof cardAssetTags)[number]
export type CardFace =
  | 'front'
  | 'back'
  | 'inside-left'
  | 'inside-right'
  | 'inside-top'
  | 'inside-bottom'

export interface CardAsset {
  id: string
  src: string
  defaultW: number
  defaultH: number
  tags: CardAssetTag[]
}

export interface CardElement {
  id: string
  kind: 'sticker' | 'text'
  assetId?: string
  text?: string
  color?: CardTextColor
  /** Text size as % of the panel height (cqh). Stickers ignore this. */
  fontSize?: number
  x: number
  y: number
  w: number
  h: number
  rotation: number
  z: number
}

/** Default text size relative to the card panel height. */
export const defaultTextFontSize = 8

export interface CardFaceDesign {
  backgroundAssetId?: string
  elements: CardElement[]
}

export interface CardDesign {
  format: CardFormatSlug
  size: CardSizeSlug
  paper: CardPaperSlug
  /** Only used when format is fold. Defaults to opening to the right. */
  foldDirection: CardFoldDirection
  faces: Record<CardFace, CardFaceDesign>
}

export const cardAssets: CardAsset[] = [
  { id: 'heart', src: '/art/card-assets/heart.svg', defaultW: 22, defaultH: 20, tags: ['shape'] },
  { id: 'star', src: '/art/card-assets/star.svg', defaultW: 20, defaultH: 20, tags: ['shape'] },
  { id: 'flower', src: '/art/card-assets/flower.svg', defaultW: 24, defaultH: 24, tags: ['nature'] },
  { id: 'leaf', src: '/art/card-assets/leaf.svg', defaultW: 18, defaultH: 24, tags: ['nature'] },
  { id: 'bunny', src: '/art/card-assets/bunny.svg', defaultW: 26, defaultH: 28, tags: ['creature'] },
  { id: 'cloud', src: '/art/card-assets/cloud.svg', defaultW: 28, defaultH: 18, tags: ['shape'] },
  { id: 'moon', src: '/art/card-assets/moon.svg', defaultW: 20, defaultH: 20, tags: ['shape'] },
  { id: 'dots-bg', src: '/art/card-assets/dots-bg.svg', defaultW: 100, defaultH: 100, tags: ['background'] },
  { id: 'stripes-bg', src: '/art/card-assets/stripes-bg.svg', defaultW: 100, defaultH: 100, tags: ['background'] },
]

export function isHorizontalFold(direction: CardFoldDirection): boolean {
  return direction === 'up' || direction === 'down'
}

export function facesForFormat(
  format: CardFormatSlug,
  foldDirection: CardFoldDirection = 'right',
): readonly CardFace[] {
  if (format === 'flat') return ['front', 'back']
  if (isHorizontalFold(foldDirection)) return ['front', 'inside-top', 'inside-bottom', 'back']
  return ['front', 'inside-left', 'inside-right', 'back']
}

export function insideFacesForDirection(direction: CardFoldDirection): readonly [CardFace, CardFace] {
  if (isHorizontalFold(direction)) return ['inside-top', 'inside-bottom']
  return ['inside-left', 'inside-right']
}

export type CardSession = 'outside' | 'inside'

export function sessionsForFormat(format: CardFormatSlug): readonly CardSession[] {
  return format === 'fold' ? ['outside', 'inside'] : ['outside']
}

export function facesForSession(
  session: CardSession,
  foldDirection: CardFoldDirection = 'right',
): readonly [CardFace, CardFace] {
  if (session === 'outside') return ['front', 'back']
  return insideFacesForDirection(foldDirection)
}

export function sessionForFace(face: CardFace): CardSession {
  return face.startsWith('inside-') ? 'inside' : 'outside'
}

export function emptyFace(): CardFaceDesign {
  return { elements: [] }
}

export function emptyFaces(): Record<CardFace, CardFaceDesign> {
  return {
    front: emptyFace(),
    back: emptyFace(),
    'inside-left': emptyFace(),
    'inside-right': emptyFace(),
    'inside-top': emptyFace(),
    'inside-bottom': emptyFace(),
  }
}

function starterElement(
  id: string,
  kind: CardElement['kind'],
  patch: Partial<CardElement>,
): CardElement {
  return {
    id,
    kind,
    x: 0,
    y: 0,
    w: 20,
    h: 20,
    rotation: 0,
    z: 1,
    ...patch,
  }
}

/** Sample art so a new card is not a blank page. */
export function createStarterDesign(
  format: CardFormatSlug = 'flat',
  size: CardSizeSlug = 'a6',
  paper: CardPaperSlug = 'cream',
  foldDirection: CardFoldDirection = 'right',
  greeting = 'Hello',
): CardDesign {
  const faces = emptyFaces()

  faces.front = {
    backgroundAssetId: 'dots-bg',
    elements: [
      starterElement('starter-heart', 'sticker', {
        assetId: 'heart',
        x: 10,
        y: 10,
        w: 16,
        h: 14,
        rotation: -14,
        z: 2,
      }),
      starterElement('starter-bunny', 'sticker', {
        assetId: 'bunny',
        x: 37,
        y: 26,
        w: 26,
        h: 28,
        z: 1,
      }),
      starterElement('starter-flower', 'sticker', {
        assetId: 'flower',
        x: 68,
        y: 12,
        w: 18,
        h: 18,
        rotation: 12,
        z: 3,
      }),
      starterElement('starter-greeting', 'text', {
        text: greeting,
        color: 'ink',
        fontSize: defaultTextFontSize,
        x: 12,
        y: 68,
        w: 76,
        h: 16,
        z: 4,
      }),
    ],
  }

  faces.back = {
    elements: [
      starterElement('starter-star', 'sticker', {
        assetId: 'star',
        x: 38,
        y: 38,
        w: 24,
        h: 24,
        z: 1,
      }),
    ],
  }

  faces['inside-left'] = {
    elements: [
      starterElement('starter-leaf-left', 'sticker', {
        assetId: 'leaf',
        x: 12,
        y: 20,
        w: 16,
        h: 22,
        rotation: -20,
        z: 1,
      }),
    ],
  }

  faces['inside-right'] = {
    elements: [
      starterElement('starter-cloud-right', 'sticker', {
        assetId: 'cloud',
        x: 30,
        y: 18,
        w: 40,
        h: 24,
        z: 1,
      }),
      starterElement('starter-inside-text', 'text', {
        text: greeting,
        color: 'muted',
        fontSize: 7,
        x: 10,
        y: 55,
        w: 80,
        h: 18,
        z: 2,
      }),
    ],
  }

  faces['inside-top'] = structuredClone(faces['inside-left'])
  faces['inside-bottom'] = structuredClone(faces['inside-right'])

  return { format, size, paper, foldDirection, faces }
}

export function createEmptyDesign(
  format: CardFormatSlug = 'flat',
  size: CardSizeSlug = 'a6',
  paper: CardPaperSlug = 'cream',
  foldDirection: CardFoldDirection = 'right',
): CardDesign {
  return { format, size, paper, foldDirection, faces: emptyFaces() }
}

export function cardAssetById(id: string | undefined): CardAsset | undefined {
  if (!id) return undefined
  return cardAssets.find((asset) => asset.id === id)
}

export function paperCssVar(slug: CardPaperSlug): string {
  return cardPapers.find((paper) => paper.slug === slug)?.cssVar ?? '--paper'
}

export function sizeAspect(slug: CardSizeSlug): number {
  return cardSizes.find((size) => size.slug === slug)?.aspect ?? 105 / 148
}

/**
 * One face in preview orientation (mm).
 * Tent folds (up/down) turn the closed face landscape so the crease sits on the long edge.
 */
export function faceSizeMm(
  size: CardSizeSlug,
  format: CardFormatSlug,
  foldDirection: CardFoldDirection = 'right',
): { widthMm: number, heightMm: number } {
  const entry = cardSizes.find((item) => item.slug === size) ?? cardSizes[0]
  if (format === 'fold' && isHorizontalFold(foldDirection)) {
    return { widthMm: entry.heightMm, heightMm: entry.widthMm }
  }
  return { widthMm: entry.widthMm, heightMm: entry.heightMm }
}

/** Two-face session spread in mm (side-by-side or stacked). */
export function spreadSizeMm(
  size: CardSizeSlug,
  format: CardFormatSlug,
  foldDirection: CardFoldDirection,
  stacked: boolean,
): { widthMm: number, heightMm: number } {
  const face = faceSizeMm(size, format, foldDirection)
  if (stacked) {
    return { widthMm: face.widthMm, heightMm: face.heightMm * 2 }
  }
  return { widthMm: face.widthMm * 2, heightMm: face.heightMm }
}

/** Face aspect for the live preview (width / height). */
export function panelAspect(
  size: CardSizeSlug,
  format: CardFormatSlug,
  foldDirection: CardFoldDirection = 'right',
): number {
  const face = faceSizeMm(size, format, foldDirection)
  return face.heightMm > 0 ? face.widthMm / face.heightMm : sizeAspect(size)
}

export function isCardFace(value: string): value is CardFace {
  return value === 'front'
    || value === 'back'
    || value === 'inside-left'
    || value === 'inside-right'
    || value === 'inside-top'
    || value === 'inside-bottom'
}

export function isCardFoldDirection(value: unknown): value is CardFoldDirection {
  return value === 'right' || value === 'left' || value === 'down' || value === 'up'
}

function isFaceDesign(value: unknown): value is CardFaceDesign {
  if (!value || typeof value !== 'object') return false
  const face = value as CardFaceDesign
  return Array.isArray(face.elements)
}

export function normalizeCardDesign(value: unknown): CardDesign | null {
  if (!value || typeof value !== 'object') return null
  const raw = value as Partial<CardDesign> & { faces?: Partial<Record<CardFace, CardFaceDesign>> }
  if (raw.format !== 'flat' && raw.format !== 'fold') return null
  if (raw.size !== 'a6' && raw.size !== 'a5' && raw.size !== 'square') return null
  if (!cardPapers.some((paper) => paper.slug === raw.paper)) return null
  if (!raw.faces || typeof raw.faces !== 'object') return null

  const foldDirection = isCardFoldDirection(raw.foldDirection) ? raw.foldDirection : 'right'
  const faces = emptyFaces()
  for (const key of Object.keys(faces) as CardFace[]) {
    const face = raw.faces[key]
    if (isFaceDesign(face)) faces[key] = face
  }

  return {
    format: raw.format,
    size: raw.size,
    paper: raw.paper,
    foldDirection,
    faces,
  }
}

export function isCardDesign(value: unknown): value is CardDesign {
  return normalizeCardDesign(value) !== null
}

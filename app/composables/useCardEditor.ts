import {
  cardAssetById,
  createStarterDesign,
  defaultTextFontSize,
  facesForFormat,
  facesForSession,
  isCardFace,
  isHorizontalFold,
  normalizeCardDesign,
  sessionForFace,
  sessionsForFormat,
  type CardDesign,
  type CardElement,
  type CardFace,
  type CardFoldDirection,
  type CardFormatSlug,
  type CardPaperSlug,
  type CardSession,
  type CardSizeSlug,
  type CardTextColor,
} from '#shared/card-editor'

function newId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `el-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function cloneDesign(design: CardDesign): CardDesign {
  return structuredClone(design)
}

export function useCardEditor() {
  const { t } = useShopI18n()
  const brand = useBrand()
  const storageKey = `${brand.storagePrefix}:card-draft-v2`

  const design = useState<CardDesign>('card-design', () => createStarterDesign())
  const activeFace = useState<CardFace>('card-active-face', () => 'front')
  const activeSession = useState<CardSession>('card-active-session', () => 'outside')
  const selectedId = useState<string | null>('card-selected-id', () => null)
  const hydrated = useState('card-editor-hydrated', () => false)

  const availableFaces = computed(() =>
    facesForFormat(design.value.format, design.value.foldDirection),
  )

  const availableSessions = computed(() => sessionsForFormat(design.value.format))

  const activeFaceDesign = computed(() => design.value.faces[activeFace.value])

  const selectedElement = computed(() =>
    activeFaceDesign.value.elements.find((entry) => entry.id === selectedId.value) ?? null,
  )

  onMounted(() => {
    if (hydrated.value) return
    hydrated.value = true

    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = normalizeCardDesign(JSON.parse(raw))
        if (parsed) {
          design.value = parsed
          ensureActiveFace()
          activeSession.value = sessionForFace(activeFace.value)
          if (!availableSessions.value.includes(activeSession.value)) {
            activeSession.value = 'outside'
          }
        } else {
          design.value = createStarterDesign('flat', 'a6', 'cream', 'right', t('cards.defaultText'))
        }
      } else {
        design.value = createStarterDesign('flat', 'a6', 'cream', 'right', t('cards.defaultText'))
      }
    } catch {
      design.value = createStarterDesign('flat', 'a6', 'cream', 'right', t('cards.defaultText'))
    }

    watch(design, (value) => {
      localStorage.setItem(storageKey, JSON.stringify(value))
    }, { deep: true })
  })

  function ensureActiveFace() {
    if (!availableFaces.value.includes(activeFace.value)) {
      activeFace.value = availableFaces.value[0] ?? 'front'
    }
  }

  function setFormat(format: CardFormatSlug) {
    design.value = { ...design.value, format }
    selectedId.value = null
    if (format === 'flat') {
      activeSession.value = 'outside'
      activeFace.value = 'front'
      return
    }
    ensureActiveFace()
    activeSession.value = sessionForFace(activeFace.value)
  }

  function setFoldDirection(foldDirection: CardFoldDirection) {
    const wasHorizontal = isHorizontalFold(design.value.foldDirection)
    const nextHorizontal = isHorizontalFold(foldDirection)
    design.value = { ...design.value, foldDirection }

    if (wasHorizontal !== nextHorizontal && activeFace.value.startsWith('inside-')) {
      activeFace.value = nextHorizontal ? 'inside-top' : 'inside-left'
    }
    selectedId.value = null
    ensureActiveFace()
  }

  function setSession(session: CardSession) {
    if (!availableSessions.value.includes(session)) return
    activeSession.value = session
    selectedId.value = null
    const pair = facesForSession(session, design.value.foldDirection)
    if (!pair.includes(activeFace.value as typeof pair[number])) {
      activeFace.value = pair[0]
    }
  }

  function setSize(size: CardSizeSlug) {
    design.value = { ...design.value, size }
  }

  function setPaper(paper: CardPaperSlug) {
    design.value = { ...design.value, paper }
  }

  function setActiveFace(face: CardFace) {
    if (!availableFaces.value.includes(face)) return
    if (activeFace.value !== face) selectedId.value = null
    activeFace.value = face
    activeSession.value = sessionForFace(face)
  }

  function setBackground(assetId: string | undefined) {
    const face = design.value.faces[activeFace.value]
    face.backgroundAssetId = assetId
  }

  function selectElement(id: string | null) {
    selectedId.value = id
  }

  function nextZ(face: CardFace = activeFace.value): number {
    const zs = design.value.faces[face].elements.map((entry) => entry.z)
    return zs.length ? Math.max(...zs) + 1 : 1
  }

  function addSticker(assetId: string) {
    const asset = cardAssetById(assetId)
    if (!asset) return
    if (asset.tags.includes('background')) {
      setBackground(assetId)
      return
    }
    const element: CardElement = {
      id: newId(),
      kind: 'sticker',
      assetId,
      x: 50 - asset.defaultW / 2,
      y: 50 - asset.defaultH / 2,
      w: asset.defaultW,
      h: asset.defaultH,
      rotation: 0,
      z: nextZ(),
    }
    design.value.faces[activeFace.value].elements.push(element)
    selectedId.value = element.id
  }

  function addText(initial = '…') {
    const element: CardElement = {
      id: newId(),
      kind: 'text',
      text: initial,
      color: 'ink',
      fontSize: defaultTextFontSize,
      x: 20,
      y: 40,
      w: 60,
      h: 18,
      rotation: 0,
      z: nextZ(),
    }
    design.value.faces[activeFace.value].elements.push(element)
    selectedId.value = element.id
  }

  function updateElement(id: string, patch: Partial<CardElement>, face: CardFace = activeFace.value) {
    const faceDesign = design.value.faces[face]
    const index = faceDesign.elements.findIndex((entry) => entry.id === id)
    if (index < 0) return
    faceDesign.elements[index] = { ...faceDesign.elements[index]!, ...patch, id }
  }

  function setTextColor(color: CardTextColor) {
    if (!selectedId.value) return
    updateElement(selectedId.value, { color })
  }

  function removeSelected() {
    if (!selectedId.value) return
    const face = design.value.faces[activeFace.value]
    face.elements = face.elements.filter((entry) => entry.id !== selectedId.value)
    selectedId.value = null
  }

  function clearFace() {
    design.value.faces[activeFace.value] = { elements: [] }
    selectedId.value = null
  }

  function resetDesign() {
    design.value = createStarterDesign(
      design.value.format,
      design.value.size,
      design.value.paper,
      design.value.foldDirection,
      t('cards.defaultText'),
    )
    selectedId.value = null
    activeFace.value = 'front'
    activeSession.value = 'outside'
  }

  function snapshot(): CardDesign {
    return cloneDesign(design.value)
  }

  function parseFace(value: string): CardFace | null {
    return isCardFace(value) ? value : null
  }

  return {
    design,
    activeFace,
    activeSession,
    selectedId,
    selectedElement,
    availableFaces,
    availableSessions,
    activeFaceDesign,
    hydrated,
    setFormat,
    setFoldDirection,
    setSession,
    setSize,
    setPaper,
    setActiveFace,
    setBackground,
    selectElement,
    addSticker,
    addText,
    updateElement,
    setTextColor,
    removeSelected,
    clearFace,
    resetDesign,
    snapshot,
    parseFace,
  }
}

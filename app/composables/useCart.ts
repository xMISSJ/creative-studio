import type { CartLine, CustomCardCartLine, ProductCartLine } from '#shared/catalog'
import { customCardPriceCents, normalizeCardDesign, type CardDesign } from '#shared/card-editor'

export interface CartNotice {
  type: 'added' | 'limit'
  /** Product slug or custom-card id. */
  key: string
  kind: 'product' | 'custom-card'
}

function isProductLine(value: unknown): value is ProductCartLine {
  if (!value || typeof value !== 'object') return false
  const line = value as ProductCartLine & { kind?: string; slug?: string }
  const kindOk = line.kind === 'product' || line.kind === undefined
  return kindOk
    && typeof line.slug === 'string'
    && Number.isInteger(line.qty)
    && line.qty > 0
    && line.qty < 100
}

function isCustomCardLine(value: unknown): value is CustomCardCartLine {
  if (!value || typeof value !== 'object') return false
  const line = value as CustomCardCartLine
  if (line.kind !== 'custom-card'
    || typeof line.id !== 'string'
    || !Number.isInteger(line.qty)
    || line.qty <= 0
    || line.qty >= 100
    || !Number.isInteger(line.price)
    || line.price <= 0) {
    return false
  }
  const design = normalizeCardDesign(line.design)
  if (!design) return false
  line.design = design
  return true
}

function normalizeLine(value: unknown): CartLine | null {
  if (!value || typeof value !== 'object') return null
  const raw = value as Record<string, unknown>

  // Legacy cart rows: { slug, qty } without kind
  if (raw.kind === undefined && typeof raw.slug === 'string' && Number.isInteger(raw.qty)) {
    const qty = raw.qty as number
    if (qty > 0 && qty < 100) return { kind: 'product', slug: raw.slug, qty }
  }

  if (isCustomCardLine(value)) return value
  if (isProductLine(value)) {
    return { kind: 'product', slug: value.slug, qty: value.qty }
  }
  return null
}

function newCardId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `card-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useCart() {
  const items = useState<CartLine[]>('cart-items', () => [])
  const isOpen = useState('cart-open', () => false)
  const notice = useState<CartNotice | null>('cart-notice', () => null)
  const hydrated = useState('cart-hydrated', () => false)
  const brand = useBrand()
  const storageKey = `${brand.storagePrefix}:cart`

  onMounted(() => {
    if (hydrated.value) return
    hydrated.value = true

    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          items.value = parsed.map(normalizeLine).filter((line): line is CartLine => line !== null)
        }
      }
    } catch {
      items.value = []
    }

    watch(items, (value) => {
      localStorage.setItem(storageKey, JSON.stringify(value))
    }, { deep: true })
  })

  const count = computed(() => items.value.reduce((sum, line) => sum + line.qty, 0))

  function add(slug: string, qty: number, stock: number) {
    const safeQty = Math.max(1, Math.floor(qty))
    const existing = items.value.find((entry): entry is ProductCartLine =>
      entry.kind === 'product' && entry.slug === slug,
    )
    const current = existing?.qty ?? 0

    if (stock <= 0 || current >= stock) {
      notice.value = { type: 'limit', key: slug, kind: 'product' }
      isOpen.value = true
      return
    }

    const next = Math.min(stock, current + safeQty)
    if (existing) existing.qty = next
    else items.value.push({ kind: 'product', slug, qty: next })

    notice.value = { type: next < current + safeQty ? 'limit' : 'added', key: slug, kind: 'product' }
    isOpen.value = true
  }

  function addCustomCard(design: CardDesign, qty = 1) {
    const safeQty = Math.min(99, Math.max(1, Math.floor(qty)))
    const id = newCardId()
    const line: CustomCardCartLine = {
      kind: 'custom-card',
      id,
      qty: safeQty,
      design: structuredClone(design),
      price: customCardPriceCents,
    }
    items.value.push(line)
    notice.value = { type: 'added', key: id, kind: 'custom-card' }
    isOpen.value = true
  }

  function setQty(slug: string, qty: number, stock: number) {
    if (qty <= 0 || stock <= 0) {
      removeProduct(slug)
      return
    }

    const line = items.value.find((entry): entry is ProductCartLine =>
      entry.kind === 'product' && entry.slug === slug,
    )
    if (!line) return
    line.qty = Math.min(stock, Math.floor(qty))
  }

  function setCustomQty(id: string, qty: number) {
    if (qty <= 0) {
      removeCustom(id)
      return
    }
    const line = items.value.find((entry): entry is CustomCardCartLine =>
      entry.kind === 'custom-card' && entry.id === id,
    )
    if (!line) return
    line.qty = Math.min(99, Math.floor(qty))
  }

  function removeProduct(slug: string) {
    items.value = items.value.filter((line) => !(line.kind === 'product' && line.slug === slug))
  }

  function removeCustom(id: string) {
    items.value = items.value.filter((line) => !(line.kind === 'custom-card' && line.id === id))
  }

  /** @deprecated Prefer removeProduct / removeCustom. Kept for product pages. */
  function remove(slug: string) {
    removeProduct(slug)
  }

  function close() {
    isOpen.value = false
  }

  return {
    items,
    count,
    isOpen,
    notice,
    hydrated,
    add,
    addCustomCard,
    setQty,
    setCustomQty,
    remove,
    removeProduct,
    removeCustom,
    close,
  }
}

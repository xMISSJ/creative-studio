import type { CartLine } from '#shared/catalog'

export interface CartNotice {
  type: 'added' | 'limit'
  slug: string
}

function isLine(value: unknown): value is CartLine {
  if (!value || typeof value !== 'object') return false
  const line = value as CartLine
  return typeof line.slug === 'string' && Number.isInteger(line.qty) && line.qty > 0 && line.qty < 100
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
        if (Array.isArray(parsed)) items.value = parsed.filter(isLine)
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
    const existing = items.value.find((entry) => entry.slug === slug)
    const current = existing?.qty ?? 0

    if (stock <= 0 || current >= stock) {
      notice.value = { type: 'limit', slug }
      isOpen.value = true
      return
    }

    const next = Math.min(stock, current + safeQty)
    if (existing) existing.qty = next
    else items.value.push({ slug, qty: next })

    notice.value = { type: next < current + safeQty ? 'limit' : 'added', slug }
    isOpen.value = true
  }

  function setQty(slug: string, qty: number, stock: number) {
    if (qty <= 0 || stock <= 0) {
      remove(slug)
      return
    }

    const line = items.value.find((entry) => entry.slug === slug)
    if (!line) return
    line.qty = Math.min(stock, Math.floor(qty))
  }

  function remove(slug: string) {
    items.value = items.value.filter((line) => line.slug !== slug)
  }

  function close() {
    isOpen.value = false
  }

  return { items, count, isOpen, notice, hydrated, add, setQty, remove, close }
}

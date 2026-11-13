<script setup lang="ts">
const { t, brand } = useShopI18n()
const { shopLink } = useShopBrowse()
const paperTexture = usePublicAsset('/art/watercolor-paper.jpg')

const brandParts = computed(() => {
  const name = brand.name
  const index = name.toLowerCase().indexOf('o')
  if (index === -1) {
    return { before: name, letter: '', after: '' }
  }
  return {
    before: name.slice(0, index),
    letter: name.slice(index, index + 1),
    after: name.slice(index + 1),
  }
})

type TrailMote = {
  el: HTMLSpanElement
  x: number
  y: number
  size: number
  strength: number
  born: number
  driftX: number
  driftY: number
  wobble: number
  alive: boolean
}

const entrance = ref<HTMLElement | null>(null)
const cursorEl = ref<HTMLElement | null>(null)
const trailLayer = ref<HTMLElement | null>(null)
const finePointer = ref(false)

let pointerQuery: MediaQueryList | null = null
let motionQuery: MediaQueryList | null = null
let originObserver: ResizeObserver | null = null
let reducedMotion = false
let originX = 0
let originY = 0
let originDirty = true
let cursorX = 0
let cursorY = 0
let drawing = false
let hasPointer = false
let lastClientX = 0
let lastClientY = 0
let lastSpawnX = 0
let lastSpawnY = 0
let lastSpawnAt = 0
let trailRaf = 0
let trailRunning = false
let trailDirty = false
let cursorVisible = false
let supportsRawUpdate = false
const motes: TrailMote[] = []

const TRAIL_LIFE_MS = 1400
const TRAIL_MAX = 40
const TRAIL_MAX_DIST = 130
const SPAWN_GAP_PX = 5

function isEntranceControl(target: EventTarget | null) {
  if (!(target instanceof Element) || !entrance.value) return false
  return Boolean(target.closest('a, button, .btn, input, textarea, select, summary'))
}

function measureOrigin() {
  if (!entrance.value) return
  const rect = entrance.value.getBoundingClientRect()
  originX = rect.left
  originY = rect.top
  originDirty = false
}

function placeCursor(x: number, y: number, visible: boolean) {
  const el = cursorEl.value
  if (!el) return
  // Transform only: keep this path cheap so pointerrawupdate can track the OS tip.
  el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
  if (visible === cursorVisible) return
  cursorVisible = visible
  el.classList.toggle('is-visible', visible)
  el.classList.toggle('is-drawing', visible)
}

function placeMote(mote: TrailMote, opacity: number) {
  mote.el.style.opacity = String(opacity)
  mote.el.style.transform = `translate3d(${mote.x}px, ${mote.y}px, 0) translate(-50%, -50%) scale(${0.65 + opacity * 0.55})`
}

function hideMote(mote: TrailMote) {
  mote.alive = false
  mote.el.style.opacity = '0'
}

function clearTrail() {
  for (const mote of motes) hideMote(mote)
  lastSpawnAt = 0
}

function stopTrailLoop() {
  trailRunning = false
  cancelAnimationFrame(trailRaf)
  trailRaf = 0
}

function tickTrail(now: number) {
  if (!trailRunning) return

  // Trail work stays on the frame loop so high-rate pointer updates only move the bead.
  if (drawing && trailDirty) {
    spawnTrail(cursorX, cursorY)
    trailDirty = false
  }

  let alive = 0
  for (const mote of motes) {
    if (!mote.alive) continue

    const age = (now - mote.born) / TRAIL_LIFE_MS
    if (age >= 1) {
      hideMote(mote)
      continue
    }

    const dist = Math.hypot(mote.x - cursorX, mote.y - cursorY)
    if (dist > TRAIL_MAX_DIST) {
      hideMote(mote)
      continue
    }

    const fade = 1 - age
    const reach = 1 - dist / TRAIL_MAX_DIST
    const opacity = mote.strength * Math.pow(fade, 1.15) * Math.pow(reach, 1.4)
    const lift = age * age
    mote.x += mote.driftX + Math.sin((now * 0.003) + mote.wobble) * 0.1
    mote.y += mote.driftY - lift * 0.06
    placeMote(mote, opacity)
    alive += 1
  }

  if (alive > 0 || drawing) {
    trailRaf = requestAnimationFrame(tickTrail)
    return
  }

  stopTrailLoop()
}

function ensureTrailLoop() {
  if (trailRunning || reducedMotion) return
  trailRunning = true
  trailRaf = requestAnimationFrame(tickTrail)
}

function takeMote() {
  const idle = motes.find(mote => !mote.alive)
  if (idle) return idle

  if (motes.length >= TRAIL_MAX) {
    let oldest = motes[0]!
    for (const mote of motes) {
      if (mote.born < oldest.born) oldest = mote
    }
    return oldest
  }

  const el = document.createElement('span')
  el.className = 'entrance-cursor-mote'
  el.style.opacity = '0'
  trailLayer.value?.append(el)
  const mote: TrailMote = {
    el,
    x: 0,
    y: 0,
    size: 6,
    strength: 1,
    born: 0,
    driftX: 0,
    driftY: 0,
    wobble: 0,
    alive: false,
  }
  motes.push(mote)
  return mote
}

function stampMote(x: number, y: number, born: number, scatter: number) {
  const mote = takeMote()
  mote.alive = true
  mote.x = x + (Math.random() - 0.5) * scatter
  mote.y = y + (Math.random() - 0.5) * scatter
  mote.born = born
  mote.size = 7 + Math.random() * 10
  mote.strength = 0.62 + Math.random() * 0.28
  mote.driftX = (Math.random() - 0.5) * 0.14
  mote.driftY = -0.06 - Math.random() * 0.14
  mote.wobble = Math.random() * Math.PI * 2
  mote.el.style.width = `${mote.size}px`
  mote.el.style.height = `${mote.size}px`
  placeMote(mote, mote.strength)
}

function spawnTrail(x: number, y: number) {
  if (reducedMotion || !drawing || !trailLayer.value) return

  const now = performance.now()
  const dx = x - lastSpawnX
  const dy = y - lastSpawnY
  const dist = lastSpawnAt === 0 ? 0 : Math.hypot(dx, dy)

  if (lastSpawnAt !== 0 && dist < SPAWN_GAP_PX) return

  const steps = dist > SPAWN_GAP_PX ? Math.min(4, Math.ceil(dist / SPAWN_GAP_PX)) : 1
  for (let i = 0; i < steps; i++) {
    const t = steps === 1 ? 1 : (i + 1) / steps
    const px = lastSpawnAt === 0 ? x : lastSpawnX + dx * t
    const py = lastSpawnAt === 0 ? y : lastSpawnY + dy * t
    stampMote(px, py, now, i === steps - 1 ? 0 : 2)
  }

  lastSpawnX = x
  lastSpawnY = y
  lastSpawnAt = now

  for (const mote of motes) {
    if (!mote.alive) continue
    if (Math.hypot(mote.x - x, mote.y - y) > TRAIL_MAX_DIST) hideMote(mote)
  }
}

function syncPointerPosition(clientX: number, clientY: number) {
  if (originDirty) measureOrigin()
  lastClientX = clientX
  lastClientY = clientY
  hasPointer = true
  cursorX = clientX - originX
  cursorY = clientY - originY
  placeCursor(cursorX, cursorY, drawing)
  if (!drawing) return
  trailDirty = true
  ensureTrailLoop()
}

function onPointerRawUpdate(event: PointerEvent) {
  // High-rate path (Chrome/Edge): position only. Hit-testing stays on pointermove.
  if (!finePointer.value || !entrance.value) return
  syncPointerPosition(event.clientX, event.clientY)
}

function onPointerMove(event: PointerEvent) {
  if (!finePointer.value || !entrance.value) return

  const nextDrawing = !isEntranceControl(event.target)
  if (!nextDrawing) lastSpawnAt = 0
  drawing = nextDrawing

  // Safari/Firefox: this is the only position signal. Chrome also gets pointerrawupdate.
  syncPointerPosition(event.clientX, event.clientY)
}

function onPointerLeave() {
  hasPointer = false
  drawing = false
  trailDirty = false
  lastSpawnAt = 0
  placeCursor(cursorX, cursorY, false)
  ensureTrailLoop()
}

function onViewportChange() {
  originDirty = true
  if (!hasPointer || !finePointer.value) return
  measureOrigin()
  const x = lastClientX - originX
  const y = lastClientY - originY
  cursorX = x
  cursorY = y
  placeCursor(x, y, drawing)
}

function onPointerChange() {
  finePointer.value = pointerQuery?.matches ?? false
  if (!finePointer.value) {
    drawing = false
    hasPointer = false
    placeCursor(cursorX, cursorY, false)
    clearTrail()
    stopTrailLoop()
  }
}

function onMotionChange() {
  reducedMotion = motionQuery?.matches ?? false
  if (reducedMotion) {
    clearTrail()
    stopTrailLoop()
  }
}

onMounted(() => {
  pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  onPointerChange()
  onMotionChange()
  pointerQuery.addEventListener('change', onPointerChange)
  motionQuery.addEventListener('change', onMotionChange)

  const node = entrance.value
  if (!node) return
  measureOrigin()
  // pointerrawupdate tracks the OS poll rate; trail stays on rAF so sparkles do not stall the bead.
  supportsRawUpdate = 'onpointerrawupdate' in window
  if (supportsRawUpdate) {
    node.addEventListener('pointerrawupdate', onPointerRawUpdate as EventListener, { passive: true })
  }
  node.addEventListener('pointermove', onPointerMove, { passive: true })
  node.addEventListener('pointerleave', onPointerLeave)
  window.addEventListener('scroll', onViewportChange, { passive: true, capture: true })
  window.addEventListener('resize', onViewportChange)
  originObserver = new ResizeObserver(onViewportChange)
  originObserver.observe(node)
})

onBeforeUnmount(() => {
  pointerQuery?.removeEventListener('change', onPointerChange)
  motionQuery?.removeEventListener('change', onMotionChange)
  if (supportsRawUpdate) {
    entrance.value?.removeEventListener('pointerrawupdate', onPointerRawUpdate as EventListener)
  }
  entrance.value?.removeEventListener('pointermove', onPointerMove)
  entrance.value?.removeEventListener('pointerleave', onPointerLeave)
  window.removeEventListener('scroll', onViewportChange, true)
  window.removeEventListener('resize', onViewportChange)
  originObserver?.disconnect()
  stopTrailLoop()
  for (const mote of motes) mote.el.remove()
  motes.length = 0
})
</script>

<template>
  <section
    ref="entrance"
    class="entrance"
    :class="{ 'has-ink-cursor': finePointer }"
    aria-labelledby="entrance-brand"
  >
    <div class="entrance-stage">
      <EntranceInk />
      <img
        class="entrance-paper"
        :src="paperTexture"
        alt=""
        width="1600"
        height="900"
        decoding="async"
        draggable="false"
        aria-hidden="true"
      >
      <div class="entrance-veil" aria-hidden="true" />
    </div>

    <div ref="trailLayer" class="entrance-cursor-trail" aria-hidden="true" />

    <div
      ref="cursorEl"
      class="entrance-cursor"
      aria-hidden="true"
    >
      <span class="entrance-cursor-bloom" />
      <span class="entrance-cursor-ring" />
      <span class="entrance-cursor-bead" />
    </div>

    <div class="entrance-copy">
      <p class="eyebrow entrance-rise">{{ t('hero.eyebrow') }}</p>
      <h1
        id="entrance-brand"
        class="entrance-brand entrance-rise delay-1"
        translate="no"
      >
        <span class="entrance-brand-en font-logo">
          <template v-if="brandParts.letter">
            {{ brandParts.before }}<span class="entrance-brand-o">{{ brandParts.letter }}<EntranceButterflies /></span>{{ brandParts.after }}
          </template>
          <template v-else>
            {{ brand.name }}
          </template>
        </span>
      </h1>
      <p class="entrance-lead entrance-rise delay-2">{{ t('hero.lead') }}</p>
      <div class="entrance-actions entrance-rise delay-3">
        <NuxtLinkLocale class="btn btn-primary" to="/shop">
          {{ t('hero.shop') }}
        </NuxtLinkLocale>
        <NuxtLinkLocale class="btn btn-ghost" :to="shopLink({ type: 'digital-art' })">
          {{ t('hero.art') }}
        </NuxtLinkLocale>
      </div>
    </div>

    <a class="entrance-scroll entrance-rise delay-3" href="#home-studio">
      <span>{{ t('hero.scroll') }}</span>
      <span class="entrance-scroll-mark" aria-hidden="true" />
    </a>
  </section>
</template>

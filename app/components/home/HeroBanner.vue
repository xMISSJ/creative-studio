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
  id: number
  x: number
  y: number
  size: number
  strength: number
  opacity: number
  born: number
  driftX: number
  driftY: number
  wobble: number
}

const entrance = ref<HTMLElement | null>(null)
const cursorX = ref(0)
const cursorY = ref(0)
const cursorVisible = ref(false)
const cursorOnControl = ref(false)
const finePointer = ref(false)
const trail = ref<TrailMote[]>([])

let pointerQuery: MediaQueryList | null = null
let motionQuery: MediaQueryList | null = null
let reducedMotion = false
let moteId = 0
let lastSpawnX = 0
let lastSpawnY = 0
let lastSpawnAt = 0
let trailRaf = 0
let trailRunning = false

const TRAIL_LIFE_MS = 1500
const TRAIL_MAX = 28
const TRAIL_MAX_DIST = 95
const SPAWN_GAP_PX = 6
const SPAWN_MIN_MS = 18

function isEntranceControl(target: EventTarget | null) {
  if (!(target instanceof Element) || !entrance.value) return false
  return Boolean(target.closest('a, button, .btn, input, textarea, select, summary'))
}

function clearTrail() {
  trail.value = []
}

function stopTrailLoop() {
  trailRunning = false
  cancelAnimationFrame(trailRaf)
  trailRaf = 0
}

function tickTrail(now: number) {
  if (!trailRunning) return

  const cx = cursorX.value
  const cy = cursorY.value
  const next: TrailMote[] = []

  for (const mote of trail.value) {
    const age = (now - mote.born) / TRAIL_LIFE_MS
    if (age >= 1) continue

    const dist = Math.hypot(mote.x - cx, mote.y - cy)
    if (dist > TRAIL_MAX_DIST) continue

    const fade = 1 - age
    const reach = 1 - dist / TRAIL_MAX_DIST
    // Keep fade timing, but taper so the ribbon stays short behind the tip.
    const opacity = mote.strength * Math.pow(fade, 0.7) * (0.25 + 0.75 * reach)
    const lift = age * age
    next.push({
      ...mote,
      x: mote.x + mote.driftX + Math.sin((now * 0.003) + mote.wobble) * 0.1,
      y: mote.y + mote.driftY - lift * 0.06,
      opacity,
    })
  }
  trail.value = next

  if (next.length > 0 || (cursorVisible.value && !cursorOnControl.value)) {
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

function spawnTrail(x: number, y: number) {
  if (reducedMotion || cursorOnControl.value) return

  const now = performance.now()
  const dx = x - lastSpawnX
  const dy = y - lastSpawnY
  const dist = Math.hypot(dx, dy)

  if (dist < SPAWN_GAP_PX && now - lastSpawnAt < SPAWN_MIN_MS) return

  lastSpawnX = x
  lastSpawnY = y
  lastSpawnAt = now

  const count = dist > 20 ? 2 : 1
  const next = trail.value.slice(-(TRAIL_MAX - count))

  for (let i = 0; i < count; i++) {
    next.push({
      id: ++moteId,
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      size: 4 + Math.random() * 7,
      strength: 0.58 + Math.random() * 0.28,
      opacity: 0.75,
      born: now - i * 12,
      driftX: (Math.random() - 0.5) * 0.16,
      driftY: -0.08 - Math.random() * 0.18,
      wobble: Math.random() * Math.PI * 2,
    })
  }

  trail.value = next
  ensureTrailLoop()
}

function onPointerMove(event: PointerEvent) {
  if (!finePointer.value || !entrance.value) return

  const rect = entrance.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const onControl = isEntranceControl(event.target)

  cursorX.value = x
  cursorY.value = y
  cursorVisible.value = true
  cursorOnControl.value = onControl

  if (onControl) return
  spawnTrail(x, y)
}

function onPointerLeave() {
  cursorVisible.value = false
  cursorOnControl.value = false
  ensureTrailLoop()
}

function onPointerChange() {
  finePointer.value = pointerQuery?.matches ?? false
  if (!finePointer.value) {
    cursorVisible.value = false
    cursorOnControl.value = false
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
})

onBeforeUnmount(() => {
  pointerQuery?.removeEventListener('change', onPointerChange)
  motionQuery?.removeEventListener('change', onMotionChange)
  stopTrailLoop()
})
</script>

<template>
  <section
    ref="entrance"
    class="entrance"
    :class="{ 'has-ink-cursor': finePointer }"
    aria-labelledby="entrance-brand"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
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

    <div class="entrance-cursor-trail" aria-hidden="true">
      <span
        v-for="mote in trail"
        :key="mote.id"
        class="entrance-cursor-mote"
        :style="{
          width: `${mote.size}px`,
          height: `${mote.size}px`,
          opacity: mote.opacity,
          transform: `translate3d(${mote.x}px, ${mote.y}px, 0) translate(-50%, -50%) scale(${0.65 + mote.opacity * 0.55})`,
        }"
      />
    </div>

    <div
      class="entrance-cursor"
      aria-hidden="true"
      :class="{ 'is-visible is-drawing': cursorVisible && !cursorOnControl }"
      :style="{
        transform: `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`,
      }"
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

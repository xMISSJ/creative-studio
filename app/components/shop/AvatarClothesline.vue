<script setup lang="ts">
import type { DigitalArtAvatar } from '#shared/catalog'

const props = defineProps<{
  avatars: DigitalArtAvatar[]
}>()

const { t } = useShopI18n()

const track = ref<HTMLElement | null>(null)
const rail = ref<HTMLElement | null>(null)
const pinRefs = ref<(HTMLElement | null)[]>([])
const wirePath = ref('')
const wireWidth = ref(1)
const wireHeight = ref(48)

const dragging = ref(false)
const idle = ref(true)
const motionOk = ref(false)
/** Desktop fine-pointer: pointer-drag + idle drift. Mobile/coarse: native swipe. */
const desktopChrome = ref(false)
const canPrev = ref(false)
const canNext = ref(false)

let dragStartX = 0
let dragStartScroll = 0
let driftRaf = 0
let layoutRaf = 0
let idleTimer: ReturnType<typeof setTimeout> | undefined
let driftDirection = 1
let motionQuery: MediaQueryList | null = null
let desktopQuery: MediaQueryList | null = null

const SAG_PX = 40
const MAX_ROT_DEG = 6
const DRIFT_PX = 0.35
const IDLE_MS = 1800
const SCROLL_STEP = 220

function setPinRef(el: Element | ComponentPublicInstance | null, index: number) {
  if (!el) {
    pinRefs.value[index] = null
    return
  }
  pinRefs.value[index] = el instanceof HTMLElement ? el : (el.$el as HTMLElement)
}

function markBusy() {
  idle.value = false
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => {
    idle.value = true
  }, IDLE_MS)
}

function syncNav() {
  const el = track.value
  if (!el) {
    canPrev.value = false
    canNext.value = false
    return
  }
  const max = Math.max(0, el.scrollWidth - el.clientWidth)
  canPrev.value = el.scrollLeft > 2
  canNext.value = el.scrollLeft < max - 2
}

function buildCurve(points: { x: number, y: number }[]) {
  if (!points.length) return ''
  if (points.length === 1) {
    const p = points[0]!
    return `M ${p.x - 48} ${p.y} L ${p.x + 48} ${p.y}`
  }

  const first = points[0]!
  const last = points[points.length - 1]!
  let d = `M ${(first.x - 40).toFixed(2)} ${first.y.toFixed(2)} L ${first.x.toFixed(2)} ${first.y.toFixed(2)}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!
    const p1 = points[i]!
    const p2 = points[i + 1]!
    const p3 = points[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }

  d += ` L ${(last.x + 40).toFixed(2)} ${last.y.toFixed(2)}`
  return d
}

function updateLayout() {
  const trackEl = track.value
  const railEl = rail.value
  if (!trackEl || !railEl || !props.avatars.length) {
    wirePath.value = ''
    syncNav()
    return
  }

  const pins = pinRefs.value.filter((pin): pin is HTMLElement => Boolean(pin))
  if (!pins.length) return

  const trackRect = trackEl.getBoundingClientRect()
  const centerX = trackRect.left + trackRect.width / 2
  const half = Math.max(trackRect.width / 2, 1)
  const railRect = railEl.getBoundingClientRect()
  const points: { x: number, y: number }[] = []
  const sagScale = desktopChrome.value ? 1 : 0.7
  const rotScale = desktopChrome.value ? 1 : 0.75

  for (const pin of pins) {
    const rect = pin.getBoundingClientRect()
    const pinCenter = rect.left + rect.width / 2
    const n = Math.max(-1.35, Math.min(1.35, (pinCenter - centerX) / half))
    const sag = SAG_PX * sagScale * (1 - n * n)
    const rot = n * MAX_ROT_DEG * rotScale

    pin.style.setProperty('--pin-y', `${sag.toFixed(2)}px`)
    pin.style.setProperty('--pin-rot', `${rot.toFixed(2)}deg`)
  }

  for (const pin of pins) {
    const peg = pin.querySelector('.clothesline-peg') as HTMLElement | null
    const anchor = peg?.getBoundingClientRect() ?? pin.getBoundingClientRect()
    points.push({
      x: anchor.left + anchor.width / 2 - railRect.left,
      y: anchor.top + anchor.height / 2 - railRect.top,
    })
  }

  wireWidth.value = Math.max(railEl.scrollWidth, trackEl.clientWidth, 1)
  wireHeight.value = Math.max(48, ...points.map((p) => p.y + 8))
  wirePath.value = buildCurve(points)
  syncNav()
}

function scheduleLayout() {
  cancelAnimationFrame(layoutRaf)
  layoutRaf = requestAnimationFrame(() => {
    updateLayout()
    requestAnimationFrame(updateLayout)
  })
}

function scrollByStep(direction: -1 | 1) {
  if (!track.value) return
  markBusy()
  track.value.scrollBy({
    left: direction * SCROLL_STEP,
    behavior: motionOk.value ? 'smooth' : 'auto',
  })
  scheduleLayout()
}

function onScroll() {
  markBusy()
  syncNav()
  scheduleLayout()
}

function onPointerDown(event: PointerEvent) {
  // Mobile/coarse: let the browser handle horizontal pan.
  if (!desktopChrome.value || event.button !== 0 || !track.value) return
  if ((event.target as HTMLElement | null)?.closest('button')) return
  dragging.value = true
  markBusy()
  dragStartX = event.clientX
  dragStartScroll = track.value.scrollLeft
  track.value.setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value || !track.value) return
  const delta = event.clientX - dragStartX
  event.preventDefault()
  track.value.scrollLeft = dragStartScroll - delta
  syncNav()
  scheduleLayout()
}

function endDrag(event: PointerEvent) {
  if (!track.value) return
  dragging.value = false
  markBusy()
  if (track.value.hasPointerCapture(event.pointerId)) {
    track.value.releasePointerCapture(event.pointerId)
  }
}

function onKeydown(event: KeyboardEvent) {
  if (!track.value) return
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    scrollByStep(-1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    scrollByStep(1)
  }
}

function onWheel(event: WheelEvent) {
  if (!desktopChrome.value || !track.value) return
  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
  if (!delta) return
  event.preventDefault()
  markBusy()
  track.value.scrollLeft += delta
  syncNav()
  scheduleLayout()
}

function tickDrift() {
  driftRaf = requestAnimationFrame(tickDrift)
  if (!desktopChrome.value || !motionOk.value || !idle.value || dragging.value || !track.value) return

  const el = track.value
  const max = el.scrollWidth - el.clientWidth
  if (max <= 0) return

  let next = el.scrollLeft + DRIFT_PX * driftDirection
  if (next >= max) {
    next = max
    driftDirection = -1
  } else if (next <= 0) {
    next = 0
    driftDirection = 1
  }
  el.scrollLeft = next
  updateLayout()
}

function onMotionChange() {
  motionOk.value = Boolean(motionQuery?.matches)
}

function onDesktopChange() {
  desktopChrome.value = Boolean(desktopQuery?.matches)
  scheduleLayout()
}

function centerTrack() {
  if (!track.value) return
  track.value.scrollLeft = Math.max(0, (track.value.scrollWidth - track.value.clientWidth) / 2)
  syncNav()
}

watch(() => props.avatars.map((a) => a.slug).join(','), async () => {
  pinRefs.value = []
  await nextTick()
  centerTrack()
  scheduleLayout()
})

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)')
  desktopQuery = window.matchMedia('(min-width: 640px) and (hover: hover) and (pointer: fine)')
  onMotionChange()
  onDesktopChange()
  motionQuery.addEventListener('change', onMotionChange)
  desktopQuery.addEventListener('change', onDesktopChange)
  window.addEventListener('resize', scheduleLayout)

  nextTick(() => {
    centerTrack()
    scheduleLayout()
    driftRaf = requestAnimationFrame(tickDrift)
  })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(driftRaf)
  cancelAnimationFrame(layoutRaf)
  clearTimeout(idleTimer)
  window.removeEventListener('resize', scheduleLayout)
  motionQuery?.removeEventListener('change', onMotionChange)
  desktopQuery?.removeEventListener('change', onDesktopChange)
})
</script>

<template>
  <div class="clothesline" :class="{ 'clothesline--desktop': desktopChrome }">
    <button
      v-if="desktopChrome"
      type="button"
      class="clothesline-nav clothesline-nav--prev icon-btn"
      :aria-label="t('shop.digitalArt.avatarsGalleryPrev')"
      :disabled="!canPrev"
      @click="scrollByStep(-1)"
    >
      <AppIcon name="chevron" class="-scale-x-100" />
    </button>

    <button
      v-if="desktopChrome"
      type="button"
      class="clothesline-nav clothesline-nav--next icon-btn"
      :aria-label="t('shop.digitalArt.avatarsGalleryNext')"
      :disabled="!canNext"
      @click="scrollByStep(1)"
    >
      <AppIcon name="chevron" />
    </button>

    <div
      class="clothesline-fade clothesline-fade--start"
      :class="{ 'is-visible': canPrev }"
      aria-hidden="true"
    />
    <div
      class="clothesline-fade clothesline-fade--end"
      :class="{ 'is-visible': canNext }"
      aria-hidden="true"
    />

    <div
      ref="track"
      class="clothesline-track"
      role="region"
      tabindex="0"
      :aria-label="t('shop.digitalArt.avatarsGalleryHint')"
      :class="{ 'is-dragging': dragging }"
      @scroll.passive="onScroll"
      @wheel="onWheel"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="endDrag"
      @pointercancel="endDrag"
      @keydown="onKeydown"
      @focus="markBusy"
    >
      <div ref="rail" class="clothesline-rail">
        <svg
          class="clothesline-wire"
          :viewBox="`0 0 ${wireWidth} ${wireHeight}`"
          :width="wireWidth"
          :height="wireHeight"
          aria-hidden="true"
          focusable="false"
        >
          <path
            v-if="wirePath"
            :d="wirePath"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
          />
        </svg>

        <ul class="clothesline-list" role="list">
          <li
            v-for="(avatar, index) in avatars"
            :key="avatar.slug"
            :ref="(el) => setPinRef(el, index)"
            class="clothesline-pin"
          >
            <span class="clothesline-peg" aria-hidden="true" />
            <figure class="clothesline-card">
              <img
                :src="avatar.image"
                alt=""
                width="400"
                height="400"
                class="clothesline-img"
                loading="lazy"
                decoding="async"
                draggable="false"
              >
            </figure>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

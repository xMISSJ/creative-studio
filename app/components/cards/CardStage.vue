<script setup lang="ts">
import {
  cardAssetById,
  defaultTextFontSize,
  facesForSession,
  isHorizontalFold,
  paperCssVar,
  spreadSizeMm,
  type CardDesign,
  type CardElement,
  type CardFace,
  type CardFaceDesign,
  type CardSession,
} from '#shared/card-editor'

/** px per mm so A5 still fits the desk; smaller sizes scale down with it. */
const PREVIEW_MM_TO_PX = 2.35

const props = defineProps<{
  design: CardDesign
  session: CardSession
  face: CardFace
  selectedId: string | null
}>()

const emit = defineEmits<{
  select: [id: string | null]
  'select-face': [face: CardFace]
  update: [id: string, patch: Partial<CardElement>, face?: CardFace]
}>()

const { t } = useShopI18n()
const stageRef = ref<HTMLElement | null>(null)
const baseURL = useRuntimeConfig().app.baseURL || '/'

const paperBackground = computed(() => `var(${paperCssVar(props.design.paper)})`)
const foldDirection = computed(() => props.design.foldDirection)
const isFold = computed(() => props.design.format === 'fold')
const isInside = computed(() => props.session === 'inside')
const panelPair = computed(() => facesForSession(props.session, foldDirection.value))

/**
 * Tent folds (up/down): landscape faces stacked.
 * Book folds (left/right): portrait faces side by side.
 */
const stackedSpread = computed(() =>
  isFold.value && isHorizontalFold(foldDirection.value),
)

const spreadMm = computed(() =>
  spreadSizeMm(
    props.design.size,
    props.design.format,
    foldDirection.value,
    stackedSpread.value,
  ),
)

const spreadStyle = computed(() => ({
  aspectRatio: `${spreadMm.value.widthMm} / ${spreadMm.value.heightMm}`,
  width: `min(100%, ${spreadMm.value.widthMm * PREVIEW_MM_TO_PX}px)`,
}))

const stageHint = computed(() => {
  if (isInside.value) return t('cards.spreadHint')
  if (isFold.value) return t('cards.outsideFoldHint')
  return t('cards.outsideHint')
})

type DragMode = 'move' | 'resize'
let dragMode: DragMode = 'move'
let dragId: string | null = null
let dragFace: CardFace = 'front'
let startX = 0
let startY = 0
let originX = 0
let originY = 0
let originW = 0
let originH = 0
let panelEl: HTMLElement | null = null

function assetSrc(assetId: string | undefined) {
  const asset = cardAssetById(assetId)
  return asset ? publicAsset(asset.src, baseURL) : ''
}

function backgroundSrc(faceDesign: CardFaceDesign) {
  const asset = cardAssetById(faceDesign.backgroundAssetId)
  return asset ? publicAsset(asset.src, baseURL) : null
}

function sortedElements(faceDesign: CardFaceDesign) {
  return [...faceDesign.elements].sort((a, b) => a.z - b.z)
}

function textColor(element: CardElement) {
  if (element.color === 'muted') return 'var(--muted)'
  if (element.color === 'accent') return 'var(--accent)'
  return 'var(--ink)'
}

function textFontSize(element: CardElement) {
  const size = element.fontSize ?? defaultTextFontSize
  return `${size}cqh`
}

function faceDesign(face: CardFace): CardFaceDesign {
  return props.design.faces[face]
}

function onPanelPointerDown(event: PointerEvent, face: CardFace) {
  if (event.target === event.currentTarget) {
    emit('select-face', face)
    emit('select', null)
  }
}

function onElementPointerDown(
  event: PointerEvent,
  element: CardElement,
  face: CardFace,
  mode: DragMode = 'move',
) {
  event.stopPropagation()
  event.preventDefault()
  const panel = (event.currentTarget as HTMLElement).closest('.card-stage-panel') as HTMLElement | null
  if (!panel) return

  emit('select-face', face)
  emit('select', element.id)
  dragMode = mode
  dragId = element.id
  dragFace = face
  panelEl = panel
  startX = event.clientX
  startY = event.clientY
  originX = element.x
  originY = element.y
  originW = element.w
  originH = element.h

  stageRef.value?.setPointerCapture(event.pointerId)
}

function onStagePointerMove(event: PointerEvent) {
  if (!dragId || !panelEl) return
  const rect = panelEl.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return

  const dx = ((event.clientX - startX) / rect.width) * 100
  const dy = ((event.clientY - startY) / rect.height) * 100

  if (dragMode === 'move') {
    emit('update', dragId, {
      x: Math.min(100 - originW, Math.max(0, originX + dx)),
      y: Math.min(100 - originH, Math.max(0, originY + dy)),
    }, dragFace)
    return
  }

  const nextW = Math.min(90, Math.max(8, originW + dx))
  const ratio = originH / originW || 1
  emit('update', dragId, {
    w: nextW,
    h: Math.min(90, Math.max(8, nextW * ratio)),
  }, dragFace)
}

function onStagePointerUp(event: PointerEvent) {
  if (!dragId || !stageRef.value) return
  try {
    stageRef.value.releasePointerCapture(event.pointerId)
  } catch {
    // ignore
  }
  dragId = null
  panelEl = null
}
</script>

<template>
  <div class="flex w-full flex-col items-center">
    <p class="sr-only">{{ stageHint }}</p>

    <div class="gallery-mat gallery-mat--flush mx-auto w-full max-w-3xl">
      <div
        ref="stageRef"
        class="relative mx-auto w-full"
        @pointermove="onStagePointerMove"
        @pointerup="onStagePointerUp"
        @pointercancel="onStagePointerUp"
      >
        <div
          class="card-spread mx-auto"
          :class="stackedSpread ? 'card-spread--horizontal' : 'card-spread--vertical'"
          :style="spreadStyle"
          role="img"
          :aria-label="isInside ? t('cards.spreadLabel') : t('cards.outsideLabel')"
        >
          <div
            v-for="(panelFace, index) in panelPair"
            :key="panelFace"
            class="card-stage-panel relative min-h-0 min-w-0 overflow-hidden border border-line"
            :class="{ 'card-stage-panel--active': face === panelFace }"
            :style="{ background: paperBackground }"
            @pointerdown="onPanelPointerDown($event, panelFace)"
          >
            <img
              v-if="backgroundSrc(faceDesign(panelFace))"
              :src="backgroundSrc(faceDesign(panelFace))!"
              alt=""
              class="pointer-events-none absolute inset-0 size-full object-cover"
              decoding="async"
            >

            <div
              v-for="element in sortedElements(faceDesign(panelFace))"
              :key="element.id"
              class="card-stage-el absolute touch-none select-none"
              :class="{ 'card-stage-el--selected': selectedId === element.id && face === panelFace }"
              :style="{
                left: `${element.x}%`,
                top: `${element.y}%`,
                width: `${element.w}%`,
                height: `${element.h}%`,
                zIndex: element.z,
                transform: `rotate(${element.rotation}deg)`,
              }"
              @pointerdown="onElementPointerDown($event, element, panelFace, 'move')"
            >
              <img
                v-if="element.kind === 'sticker'"
                :src="assetSrc(element.assetId)"
                alt=""
                class="pointer-events-none size-full object-contain"
                draggable="false"
                decoding="async"
              >
              <p
                v-else
                class="card-stage-text pointer-events-none flex size-full items-center justify-center overflow-hidden px-1 text-center font-display leading-tight font-bold break-words"
                :style="{ color: textColor(element), fontSize: textFontSize(element) }"
              >
                {{ element.text }}
              </p>

              <button
                v-if="selectedId === element.id && face === panelFace"
                type="button"
                class="card-stage-handle"
                :aria-label="t('cards.resizeHandle')"
                @pointerdown="onElementPointerDown($event, element, panelFace, 'resize')"
              />
            </div>

            <span class="card-panel-label">{{ t(`cards.faces.${panelFace}`) }}</span>
            <span
              v-if="isInside && index === 0"
              class="card-crease-badge"
              :class="stackedSpread ? 'card-crease-badge--bottom' : 'card-crease-badge--right'"
            >
              {{ t('cards.foldLabel') }}
            </span>
          </div>

          <div
            v-if="isInside"
            class="card-crease"
            :class="stackedSpread ? 'card-crease--horizontal' : 'card-crease--vertical'"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

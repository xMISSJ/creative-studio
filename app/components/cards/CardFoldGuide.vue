<script setup lang="ts">
import {
  faceSizeMm,
  insideFacesForDirection,
  isHorizontalFold,
  type CardFace,
  type CardFoldDirection,
  type CardSizeSlug,
} from '#shared/card-editor'

const props = defineProps<{
  direction: CardFoldDirection
  size: CardSizeSlug
  activeFace: CardFace
}>()

const emit = defineEmits<{
  selectFace: [face: CardFace]
}>()

const { t } = useShopI18n()

const horizontal = computed(() => isHorizontalFold(props.direction))
const insides = computed(() => insideFacesForDirection(props.direction))
const summary = computed(() => t(`cards.foldDirections.${props.direction}.open`))
const faceMm = computed(() => faceSizeMm(props.size, 'fold', props.direction))

const closedStyle = computed(() => ({
  aspectRatio: `${faceMm.value.widthMm} / ${faceMm.value.heightMm}`,
}))

const openStyle = computed(() => {
  const { widthMm, heightMm } = faceMm.value
  if (horizontal.value) {
    return { aspectRatio: `${widthMm} / ${heightMm * 2}` }
  }
  return { aspectRatio: `${widthMm * 2} / ${heightMm}` }
})

function isActive(face: CardFace) {
  return props.activeFace === face
}
</script>

<template>
  <div class="card-fold-guide" :aria-label="t('cards.foldGuideLabel')">
    <div class="card-fold-guide-row">
      <div class="card-fold-guide-item">
        <span class="card-fold-guide-caption">{{ t('cards.foldClosed') }}</span>
        <button
          type="button"
          class="card-fold-mini"
          :class="{ 'card-fold-mini--active': isActive('front') }"
          :style="closedStyle"
          :aria-label="t('cards.faces.front')"
          :aria-pressed="isActive('front')"
          @click="emit('selectFace', 'front')"
        >
          <span class="card-fold-mini-face">{{ t('cards.facesShort.front') }}</span>
          <span
            class="card-fold-mini-crease"
            :class="`card-fold-mini-crease--${direction === 'right' ? 'left' : direction === 'left' ? 'right' : direction === 'down' ? 'top' : 'bottom'}`"
            aria-hidden="true"
          />
        </button>
      </div>

      <div class="card-fold-guide-item">
        <span class="card-fold-guide-caption">{{ t('cards.foldOpen') }}</span>
        <div
          class="card-fold-spread-mini"
          :class="horizontal ? 'card-fold-spread-mini--horizontal' : 'card-fold-spread-mini--vertical'"
          :style="openStyle"
        >
          <button
            type="button"
            class="card-fold-mini-face"
            :class="{ 'card-fold-mini-face--active': isActive(insides[0]) }"
            :aria-label="t(`cards.faces.${insides[0]}`)"
            :aria-pressed="isActive(insides[0])"
            @click="emit('selectFace', insides[0])"
          >
            {{ t(`cards.facesShort.${insides[0]}`) }}
          </button>
          <span class="card-fold-spread-crease" aria-hidden="true" />
          <button
            type="button"
            class="card-fold-mini-face"
            :class="{ 'card-fold-mini-face--active': isActive(insides[1]) }"
            :aria-label="t(`cards.faces.${insides[1]}`)"
            :aria-pressed="isActive(insides[1])"
            @click="emit('selectFace', insides[1])"
          >
            {{ t(`cards.facesShort.${insides[1]}`) }}
          </button>
        </div>
      </div>

      <p class="card-fold-guide-summary">{{ summary }}</p>
    </div>
  </div>
</template>

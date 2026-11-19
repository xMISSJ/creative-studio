<script setup lang="ts">
import {
  cardFoldDirections,
  cardFormats,
  cardPapers,
  cardSizes,
  type CardFoldDirection,
  type CardFormatSlug,
  type CardPaperSlug,
  type CardSizeSlug,
} from '#shared/card-editor'

defineProps<{
  format: CardFormatSlug
  foldDirection: CardFoldDirection
  size: CardSizeSlug
  paper: CardPaperSlug
}>()

const emit = defineEmits<{
  'update:format': [value: CardFormatSlug]
  'update:foldDirection': [value: CardFoldDirection]
  'update:size': [value: CardSizeSlug]
  'update:paper': [value: CardPaperSlug]
}>()

const { t } = useShopI18n()

function paperStyle(slug: CardPaperSlug) {
  const paper = cardPapers.find((entry) => entry.slug === slug)
  return paper ? { background: `var(${paper.cssVar})` } : undefined
}
</script>

<template>
  <div
    class="card-setup-bar"
    :class="{ 'card-setup-bar--fold': format === 'fold' }"
    :aria-label="t('cards.setupLabel')"
  >
    <section class="card-setup-group">
      <h2 class="card-setup-label">{{ t('cards.formatsTitle') }}</h2>
      <div class="card-setup-options" role="group" :aria-label="t('cards.formatsTitle')">
        <button
          v-for="entry in cardFormats"
          :key="entry.slug"
          type="button"
          class="chip"
          :aria-current="format === entry.slug ? 'true' : undefined"
          @click="emit('update:format', entry.slug)"
        >
          {{ t(`cards.formats.${entry.slug}`) }}
        </button>
      </div>
    </section>

    <section v-if="format === 'fold'" class="card-setup-group card-setup-group--fold">
      <h2 class="card-setup-label">{{ t('cards.foldDirectionsTitle') }}</h2>
      <div
        class="card-setup-options"
        role="group"
        :aria-label="t('cards.foldDirectionsTitle')"
        :aria-describedby="'card-fold-dir-hint'"
      >
        <button
          v-for="entry in cardFoldDirections"
          :key="entry.slug"
          type="button"
          class="chip"
          :aria-current="foldDirection === entry.slug ? 'true' : undefined"
          :title="t(`cards.foldDirections.${entry.slug}.closed`)"
          @click="emit('update:foldDirection', entry.slug)"
        >
          {{ t(`cards.foldDirections.${entry.slug}.label`) }}
        </button>
      </div>
      <p id="card-fold-dir-hint" class="sr-only">{{ t('cards.foldDirectionsLead') }}</p>
    </section>

    <section class="card-setup-group">
      <h2 class="card-setup-label">{{ t('cards.sizesTitle') }}</h2>
      <div class="card-setup-options" role="group" :aria-label="t('cards.sizesTitle')">
        <button
          v-for="entry in cardSizes"
          :key="entry.slug"
          type="button"
          class="chip"
          :aria-current="size === entry.slug ? 'true' : undefined"
          @click="emit('update:size', entry.slug)"
        >
          {{ t(`cards.sizes.${entry.slug}`) }}
        </button>
      </div>
    </section>

    <section class="card-setup-group">
      <h2 class="card-setup-label">{{ t('cards.papersTitle') }}</h2>
      <div class="card-setup-options card-setup-options--swatches" role="list" :aria-label="t('cards.papersTitle')">
        <button
          v-for="entry in cardPapers"
          :key="entry.slug"
          type="button"
          role="listitem"
          class="card-paper-swatch"
          :class="{ 'card-paper-swatch--active': paper === entry.slug }"
          :style="paperStyle(entry.slug)"
          :aria-label="t(`cards.papers.${entry.slug}`)"
          :aria-pressed="paper === entry.slug"
          @click="emit('update:paper', entry.slug)"
        />
      </div>
    </section>
  </div>
</template>

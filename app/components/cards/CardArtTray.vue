<script setup lang="ts">
import { cardAssets } from '#shared/card-editor'

const emit = defineEmits<{
  addSticker: [assetId: string]
  clearBackground: []
  addText: []
  clearFace: []
}>()

const { t } = useShopI18n()
const baseURL = useRuntimeConfig().app.baseURL || '/'

const stickers = computed(() => cardAssets.filter((asset) => !asset.tags.includes('background')))
const backgrounds = computed(() => cardAssets.filter((asset) => asset.tags.includes('background')))

function assetUrl(src: string) {
  return publicAsset(src, baseURL)
}
</script>

<template>
  <aside class="card-art-tray" :aria-label="t('cards.artTrayLabel')">
    <section class="card-art-section">
      <h2 class="card-setup-label">{{ t('cards.stickersTitle') }}</h2>
      <div class="card-art-grid">
        <button
          v-for="asset in stickers"
          :key="asset.id"
          type="button"
          class="card-asset-btn"
          :aria-label="t(`cards.assets.${asset.id}`)"
          @click="emit('addSticker', asset.id)"
        >
          <img :src="assetUrl(asset.src)" alt="" width="48" height="48" class="size-9 object-contain sm:size-10" decoding="async">
        </button>
      </div>
    </section>

    <section class="card-art-section">
      <h2 class="card-setup-label">{{ t('cards.backgroundsTitle') }}</h2>
      <div class="card-art-grid card-art-grid--bg">
        <button
          v-for="asset in backgrounds"
          :key="asset.id"
          type="button"
          class="card-asset-btn"
          :aria-label="t(`cards.assets.${asset.id}`)"
          @click="emit('addSticker', asset.id)"
        >
          <img :src="assetUrl(asset.src)" alt="" width="64" height="48" class="h-10 w-full object-cover" decoding="async">
        </button>
        <button
          type="button"
          class="card-asset-btn px-2 text-xs font-bold text-muted"
          @click="emit('clearBackground')"
        >
          {{ t('cards.clearBackground') }}
        </button>
      </div>
    </section>

    <div class="card-art-actions">
      <button type="button" class="btn btn-ghost w-full justify-center" @click="emit('addText')">
        {{ t('cards.addText') }}
      </button>
      <button type="button" class="link link-hit self-center text-sm lg:self-start" @click="emit('clearFace')">
        {{ t('cards.clearFace') }}
      </button>
    </div>
  </aside>
</template>

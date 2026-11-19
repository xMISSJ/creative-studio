<script setup lang="ts">
import type { CardElement, CardFace } from '#shared/card-editor'

const { t } = useShopI18n()
const cart = useCart()
const editor = useCardEditor()

const {
  design,
  activeFace,
  activeSession,
  selectedId,
  selectedElement,
  availableSessions,
  setFormat,
  setFoldDirection,
  setSession,
  setSize,
  setPaper,
  setActiveFace,
  selectElement,
  addSticker,
  addText,
  updateElement,
  removeSelected,
  clearFace,
  snapshot,
} = editor

function onAddSticker(assetId: string) {
  addSticker(assetId)
}

function onUpdateSelected(patch: Partial<CardElement>) {
  if (!selectedId.value) return
  updateElement(selectedId.value, patch)
}

function onStageUpdate(id: string, patch: Partial<CardElement>, face?: CardFace) {
  updateElement(id, patch, face ?? activeFace.value)
}

function onAddToCart() {
  cart.addCustomCard(snapshot())
}
</script>

<template>
  <div class="card-studio">
    <CardSetupBar
      :format="design.format"
      :fold-direction="design.foldDirection"
      :size="design.size"
      :paper="design.paper"
      @update:format="setFormat"
      @update:fold-direction="setFoldDirection"
      @update:size="setSize"
      @update:paper="setPaper"
    />

    <div
      class="card-studio-workspace"
      :class="{ 'card-studio-workspace--inspector': !!selectedElement }"
    >
      <CardArtTray
        @add-sticker="onAddSticker"
        @clear-background="editor.setBackground(undefined)"
        @add-text="addText(t('cards.defaultText'))"
        @clear-face="clearFace"
      />

      <div class="card-studio-stage">
        <div class="card-studio-stage-chrome">
          <CardFaceTabs
            :sessions="availableSessions"
            :model-value="activeSession"
            @update:model-value="setSession"
          />

          <CardFoldGuide
            v-if="design.format === 'fold'"
            :direction="design.foldDirection"
            :size="design.size"
            :active-face="activeFace"
            @select-face="setActiveFace"
          />
        </div>

        <div class="card-studio-desk">
          <CardStage
            :design="design"
            :session="activeSession"
            :face="activeFace"
            :selected-id="selectedId"
            @select="selectElement"
            @select-face="setActiveFace"
            @update="onStageUpdate"
          />
        </div>

        <p class="card-studio-hint">{{ t('cards.stageHint') }}</p>

        <CardPropertiesPanel
          v-if="selectedElement"
          class="card-studio-inspector lg:hidden"
          :element="selectedElement"
          @update="onUpdateSelected"
          @remove="removeSelected"
        />
      </div>

      <CardPropertiesPanel
        v-if="selectedElement"
        class="card-studio-inspector card-studio-inspector--side hidden lg:flex"
        :element="selectedElement"
        @update="onUpdateSelected"
        @remove="removeSelected"
      />
    </div>

    <CardAddToCart @add="onAddToCart" />
  </div>
</template>

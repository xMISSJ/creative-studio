<script setup lang="ts">
const { t, brand } = useShopI18n()
const { shopLink } = useShopBrowse()
const paperTexture = usePublicAsset('/art/watercolor-paper.jpg')

const entrance = ref<HTMLElement | null>(null)
const entranceHeight = ref('')

function measureEntrance() {
  if (!import.meta.client || !entrance.value) return

  const main = document.getElementById('main')
  const mainTop = main?.getBoundingClientRect().top ?? 0
  const nextHeight = Math.max(window.innerHeight - mainTop, 320)

  entranceHeight.value = `${nextHeight}px`
}

onMounted(() => {
  measureEntrance()
  window.addEventListener('resize', measureEntrance)
  window.visualViewport?.addEventListener('resize', measureEntrance)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureEntrance)
  window.visualViewport?.removeEventListener('resize', measureEntrance)
})
</script>

<template>
  <section
    ref="entrance"
    class="entrance"
    :style="entranceHeight ? { height: entranceHeight } : undefined"
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

    <div class="entrance-copy">
      <p class="eyebrow entrance-rise">{{ t('hero.eyebrow') }}</p>
      <h1
        id="entrance-brand"
        class="entrance-brand entrance-rise delay-1"
        translate="no"
      >
        <span class="entrance-brand-en font-logo">{{ brand.name }}</span>
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

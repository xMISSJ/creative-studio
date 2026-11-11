<script setup lang="ts">
const { t, brand } = useShopI18n()

const entrance = ref<HTMLElement | null>(null)
const entranceHeight = ref('')

function measureEntrance() {
  if (!import.meta.client || !entrance.value) return

  const main = document.getElementById('main')
  const bottomNav = document.querySelector<HTMLElement>('.bottom-nav')
  const mainTop = main?.getBoundingClientRect().top ?? 0
  const bottomNavVisible = Boolean(
    bottomNav
    && bottomNav.offsetParent !== null
    && getComputedStyle(bottomNav).display !== 'none',
  )
  const bottomNavHeight = bottomNavVisible ? bottomNav.getBoundingClientRect().height : 0
  const nextHeight = Math.max(window.innerHeight - mainTop - bottomNavHeight, 320)

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
      <div class="entrance-veil" aria-hidden="true" />
    </div>

    <div class="entrance-copy">
      <p class="eyebrow entrance-rise">{{ t('hero.eyebrow') }}</p>
      <h1
        id="entrance-brand"
        class="entrance-brand entrance-rise delay-1 font-logo"
        translate="no"
      >
        {{ brand.name }}
      </h1>
      <p class="entrance-title entrance-rise delay-2">{{ t('hero.title') }}</p>
      <p class="entrance-lead entrance-rise delay-2">{{ t('hero.lead') }}</p>
      <div class="entrance-actions entrance-rise delay-3">
        <NuxtLinkLocale class="btn btn-primary" to="/shop">
          {{ t('hero.shop') }}
        </NuxtLinkLocale>
      </div>
    </div>

    <a class="entrance-scroll entrance-rise delay-3" href="#home-studio">
      <span>{{ t('hero.scroll') }}</span>
      <span class="entrance-scroll-mark" aria-hidden="true" />
    </a>
  </section>
</template>

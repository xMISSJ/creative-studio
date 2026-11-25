<script setup lang="ts">
const { t } = useShopI18n()
const art = usePublicAsset('/art/characters-drawing-desk.png')
</script>

<template>
  <section class="home-band" aria-labelledby="home-desk-moment-title">
    <div class="container-page text-center">
      <h2 id="home-desk-moment-title" class="section-title">
        {{ t('home.deskMomentTitle') }}
      </h2>
      <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        {{ t('home.deskMomentLead') }}
      </p>
      <div class="mt-6">
        <NuxtLinkLocale class="btn btn-primary" to="/about">
          {{ t('home.togetherCta') }}
        </NuxtLinkLocale>
      </div>
      <img
        class="mx-auto mt-8 w-full max-w-xl object-contain sm:max-w-2xl lg:max-w-3xl"
        :src="art"
        :alt="t('home.deskMomentAlt')"
        width="1507"
        height="941"
        decoding="async"
        loading="lazy"
      >
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useShopI18n()
</script>

<template>
  <section id="home-studio" class="container-page scroll-mt-8 py-14 text-center sm:py-16">
    <h2 class="font-display text-3xl text-ink sm:text-4xl">{{ t('home.noteTitle') }}</h2>
    <p class="mx-auto mt-5 max-w-2xl text-muted">
      {{ t('home.togetherBody') }}
    </p>
    <div class="mt-7">
      <NuxtLinkLocale class="btn btn-primary" to="/about">
        {{ t('home.togetherCta') }}
      </NuxtLinkLocale>
    </div>
  </section>
</template>

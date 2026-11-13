<script setup lang="ts">
const { t } = useShopI18n()
</script>

<template>
  <section id="home-studio" class="container-page py-10 sm:py-12">
    <div class="home-panel text-center">
      <h2 class="section-title">{{ t('home.noteTitle') }}</h2>
      <p class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        {{ t('home.togetherBody') }}
      </p>
      <div class="mt-8">
        <NuxtLinkLocale class="btn btn-primary" to="/about">
          {{ t('home.togetherCta') }}
        </NuxtLinkLocale>
      </div>
    </div>
  </section>
</template>

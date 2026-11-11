<script setup lang="ts">
const { t, brand } = useShopI18n()
</script>

<template>
  <section class="container-page py-14 text-center sm:py-16">
    <h2 class="font-display text-3xl font-bold text-ink sm:text-4xl">
      {{ t('home.togetherTitle') }}
    </h2>
    <p class="font-logo mt-2 text-4xl text-ink sm:text-5xl" translate="no">{{ brand.name }}</p>
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

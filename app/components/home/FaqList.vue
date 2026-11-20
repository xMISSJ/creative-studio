<script setup lang="ts">
const { t } = useShopI18n()
const items = useFaqItems()
</script>

<template>
  <section id="faq" class="home-band home-band-soft" aria-labelledby="faq-title">
    <div class="container-page">
      <h2 id="faq-title" class="section-title">{{ t('home.faq.title') }}</h2>
      <p class="mx-auto mt-5 max-w-xl text-center text-muted">{{ t('home.faq.lead') }}</p>
      <div class="faq-panel mx-auto mt-10 max-w-2xl rounded-md border border-line bg-paper px-5 py-2 sm:px-8 sm:py-3">
        <FaqAccordion :items="items" />
      </div>
    </div>
  </section>
</template>

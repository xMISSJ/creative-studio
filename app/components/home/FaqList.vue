<script setup lang="ts">
const { t } = useShopI18n()
const items = useFaqItems()
</script>

<template>
  <section id="faq" class="container-page scroll-mt-28 py-10 sm:py-12" aria-labelledby="faq-title">
    <h2 id="faq-title" class="section-title">{{ t('home.faq.title') }}</h2>
    <p class="mt-3 text-center text-muted">{{ t('home.faq.lead') }}</p>
    <div class="faq-panel mx-auto mt-8 max-w-2xl rounded-[1.75rem] border border-line bg-paper px-5 py-2 sm:px-8 sm:py-3">
      <FaqAccordion :items="items" />
    </div>
    <p class="mt-8 text-center">
      <NuxtLinkLocale class="shop-now" to="/faq">
        {{ t('home.faq.more') }}
        <AppIcon name="chevron" />
      </NuxtLinkLocale>
    </p>
  </section>
</template>

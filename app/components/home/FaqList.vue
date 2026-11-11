<script setup lang="ts">
const { t } = useShopI18n()

const items = computed(() => [
  { id: 'faq-1', q: t('home.faq.items.0.q'), a: t('home.faq.items.0.a') },
  { id: 'faq-2', q: t('home.faq.items.1.q'), a: t('home.faq.items.1.a') },
  { id: 'faq-3', q: t('home.faq.items.2.q'), a: t('home.faq.items.2.a') },
  { id: 'faq-4', q: t('home.faq.items.3.q'), a: t('home.faq.items.3.a') },
  { id: 'faq-5', q: t('home.faq.items.4.q'), a: t('home.faq.items.4.a') },
])
</script>

<template>
  <section class="container-page py-10 sm:py-12" :aria-labelledby="'faq-title'">
    <h2 id="faq-title" class="section-title">{{ t('home.faq.title') }}</h2>
    <p class="mt-3 text-center text-muted">{{ t('home.faq.lead') }}</p>
    <div class="mx-auto mt-8 max-w-2xl">
      <details
        v-for="(item, index) in items"
        :key="item.id"
        class="faq-item"
      >
        <summary>
          <span>{{ index + 1 }}. {{ item.q }}</span>
          <span class="text-accent" aria-hidden="true">+</span>
        </summary>
        <p class="pb-4 text-muted">{{ item.a }}</p>
      </details>
    </div>
  </section>
</template>

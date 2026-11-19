<script setup lang="ts">
const { t } = useShopI18n()
usePageMeta('meta.cardsTitle', 'meta.cardsDescription')
</script>

<template>
  <section>
    <div class="container-page py-8 sm:py-10">
      <PageIntro
        :eyebrow="t('cards.eyebrow')"
        :title="t('cards.title')"
        :lead="t('cards.lead')"
      />
    </div>

    <div class="card-studio-band border-y border-line">
      <div class="container-page py-8 sm:py-12">
        <CardStudio />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useShopI18n()
usePageMeta('meta.faqTitle', 'meta.faqDescription')
const items = useFaqItems()
</script>

<template>
  <article>
    <section class="bg-lilac-mist text-on-soft">
      <div class="container-page py-12 sm:py-16">
        <div class="rise">
          <PageIntro
            :eyebrow="t('faq.eyebrow')"
            :title="t('faq.title')"
            :lead="t('faq.lead')"
          />
        </div>
      </div>
    </section>

    <section class="container-page py-12 sm:py-16" :aria-label="t('faq.title')">
      <div class="faq-panel rise delay-1 mx-auto max-w-2xl rounded-md border border-line bg-paper px-5 py-2 sm:px-8 sm:py-3">
        <FaqAccordion :items="items" />
      </div>

      <aside class="rise delay-2 mx-auto mt-10 max-w-2xl overflow-hidden rounded-md bg-lilac-soft p-7 text-on-soft sm:mt-12 sm:p-9">
        <p class="text-xs font-bold tracking-[0.08em] uppercase opacity-80">{{ t('faq.stillEyebrow') }}</p>
        <h2 class="display-title mt-3 text-2xl sm:text-3xl">
          {{ t('faq.stillTitle') }}
        </h2>
        <p class="mt-3 max-w-lg text-base leading-relaxed opacity-90">
          {{ t('faq.stillBody') }}
        </p>
        <div class="mt-7 flex flex-wrap gap-3">
          <NuxtLinkLocale class="btn btn-primary" to="/shop">{{ t('faq.shopCta') }}</NuxtLinkLocale>
          <NuxtLinkLocale class="btn btn-ghost border-on-soft/25 text-on-soft" to="/about">
            {{ t('faq.aboutCta') }}
          </NuxtLinkLocale>
        </div>
      </aside>
    </section>
  </article>
</template>

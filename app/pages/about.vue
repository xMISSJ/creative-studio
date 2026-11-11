<script setup lang="ts">
const { t } = useShopI18n()
usePageMeta('meta.aboutTitle', 'meta.aboutDescription')
</script>

<template>
  <article>
    <section class="bg-lilac text-on-soft">
      <div class="container-page grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <PageIntro :eyebrow="t('about.eyebrow')" :title="t('about.title')" :lead="t('about.lead')" />
        <div class="mat">
          <img src="/art/studio_desk.jpg" :alt="t('about.alt')" width="1340" height="900" class="aspect-[4/5] w-full rounded-[1.2rem] object-cover">
        </div>
      </div>
    </section>

    <div class="container-page py-12">
      <div class="max-w-3xl space-y-4 text-lg">
        <p>{{ t('about.story') }}</p>
        <p>{{ t('about.storyGrief') }}</p>
        <p>{{ t('about.storyArt') }}</p>
      </div>
      <div class="mt-10">
        <NuxtLinkLocale class="btn btn-primary" to="/shop">{{ t('about.shop') }}</NuxtLinkLocale>
      </div>
      <div class="mt-16">
        <NewsletterPanel />
      </div>
    </div>
  </article>
</template>
